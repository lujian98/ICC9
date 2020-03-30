import { CdkDrag, CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Subject } from 'rxjs';
import { IccField } from '../../items';
import { IccTableConfigs, IccGroupHeader } from '../../models';

export interface IccTableChange {
  changes: {};
}

@Injectable({
  providedIn: 'root'
})
export class IccColumnHeaderService {
  private _visibleColumns: IccField[] = [];
  private _groupHeaderColumns: IccGroupHeader[] = [];

  tableWidth: number;
  isColumnResizing: boolean;

  private pressed = false;
  private currentResizeIndex: number;
  private startX: number;
  private startWidth: number;
  private isResizingRight: boolean;
  private resizableMousemove: () => void;
  private resizableMouseup: () => void;
  private resizableMouseleave: () => void;
  private viewportWidth: number;
  private allowChangeFlexWidth: boolean;
  private cellData: Array<any>;
  private previousIndex: number;
  private currentIndex: number;

  isColumnResized$: Subject<{}> = new Subject();
  tableChange$ = new BehaviorSubject<IccTableChange>({ changes: null });

  set visibleColumns(val: IccField[]) {
    this._visibleColumns = val;
  }

  get visibleColumns(): IccField[] {
    return this._visibleColumns;
  }

  set groupHeaderColumns(val: IccGroupHeader[]) {
    this._groupHeaderColumns = val;
  }

  get groupHeaderColumns(): IccGroupHeader[] {
    return this._groupHeaderColumns;
  }

  constructor() { }

  public setColumnChanges(columns: IccField[], tableConfigs: IccTableConfigs) {
    this.setColumnSticky(columns, tableConfigs);
    this.groupHeaderColumns = [];
    columns.forEach((column, index) => {
      column.index = index;
      if (!column.hidden && column.itemConfig.hidden !== 'always') {
        this.setGroupHeader(column);
      }
    });
    this.visibleColumns = columns.filter(column => column.hidden !== 'always');
  }

  public setGroupHeaderSticky() {
    this.groupHeaderColumns.forEach(header => {
      const columns = this.visibleColumns.filter(column => {
        const groupname = column.groupHeader ? column.groupHeader.name : `group${column.name}`;
        return header.name === groupname;
      });
      if (columns.length > 0) {
        header.width = 0;
        columns.forEach((column, index) => {
          if (index === 0) {
            Object.assign(header, {
              dragDisabled: column.sticky || column.stickyEnd ? true : column.dragDisabled,
              sticky: column.sticky,
              stickyEnd: column.stickyEnd,
              left: column.left,
              right: column.right
            });
          }
          if (column.groupHeader && column.stickyEnd && index === columns.length - 1) {
            header.right = column.right;
          }
          header.width += column.width;
        });
      }
    });
  }

  private setGroupHeader(column: IccField) {
    let groupHeader: IccGroupHeader = {
      name: `group${column.name}`,
      index: column.index,
      // title: column.title,
      width: column.width,
      colspan: 1
    };
    if (column.groupHeader) {
      const header = this.groupHeaderColumns.filter(item => item.name === column.groupHeader.name);
      if (header.length === 0) {
        groupHeader = column.groupHeader;
        groupHeader.colspan = 1;
        groupHeader.index = column.index; // first grouped header column index
        this.groupHeaderColumns.push(groupHeader);
      } else {
        header[0].colspan++;
      }
    } else {
      this.groupHeaderColumns.push(groupHeader);
    }
  }

  getTableWidth(viewportWidth: number): number {
    const tableWidth = this.getTableSize();
    let dx = 0;
    if (this.isAllFlexColumns() || viewportWidth > tableWidth) {
      dx = viewportWidth - tableWidth;
    } else if (this.allowChangeFlexWidth && viewportWidth < this.viewportWidth) {
      dx = viewportWidth - this.viewportWidth;
    }
    if (dx !== 0) {
      this.adjustColumnsWidth(dx, -1);
    }
    this.setGroupHeaderColumnWidth();
    const newTableWidth = this.getTableSize();
    this.tableWidth = this.isAllFlexColumns() && newTableWidth > viewportWidth ? viewportWidth : newTableWidth;
    this.viewportWidth = viewportWidth;
    this.allowChangeFlexWidth = this.tableWidth <= viewportWidth;
    return this.tableWidth;
  }

  private isAllFlexColumns() {
    const flexColumns = this.visibleColumns.filter(column => column.fixedWidth === 'auto');
    const changableColumns = this.visibleColumns.filter(column => column.fixedWidth !== true);
    return flexColumns.length === changableColumns.length;
  }

  private adjustColumnsWidth(dx: number, index: number) {
    const flexColumns = this.visibleColumns.filter((column, i) => column.fixedWidth === 'auto' && i !== index);
    if (flexColumns.length > 0) {
      dx /= flexColumns.length;
      this.visibleColumns.forEach((column, i) => {
        if (column.fixedWidth === 'auto' && i !== index) {
          const newWidth = column.width + dx;
          column.width = newWidth > column.minWidth ? newWidth : column.minWidth;
        }
      });
    }
  }

  private getTableSize(): number {
    let width = 0;
    this.visibleColumns.forEach(column => {
      if (this.isColumnVisible(column)) {
        width += column.width;
      }
    });
    return width;
  }

  private getResizedColumnIndex(event, cdkTableRef: ElementRef): number {
    let resizedColumnIndex = -1;
    this.visibleColumns.filter((column: IccField, i) => {
      const cellData = this.getCellData(i, cdkTableRef);
      if (cellData.x <= event.pageX && cellData.right > event.pageX) {
        resizedColumnIndex = i;
      }
    });
    return resizedColumnIndex;
  }

  onResizeHeaderColumn(event: any, index: number, enableColumnResize: boolean, renderer: Renderer2, cdkTableRef: ElementRef) {
    const resizedColumnIndex = this.getResizedColumnIndex(event, cdkTableRef);
    if (resizedColumnIndex > -1) {
      this.onResizeColumn(event, resizedColumnIndex, enableColumnResize, renderer, cdkTableRef);
    }
  }

  checkHeaderResizeORDnD(event: any, index: number, cdkTableRef: ElementRef) {
    const resizedColumnIndex = this.getResizedColumnIndex(event, cdkTableRef);
    this.checkResizeORDnD(event, resizedColumnIndex, cdkTableRef);
  }

  checkResizeORDnD(event: any, index: number, cdkTableRef: ElementRef) {
    if (!this.pressed) {
      this.isColumnResizing = false;
      this.checkIsResizing(event, index, cdkTableRef);
    }
  }

  onResizeColumn(event: any, index: number, enableColumnResize: boolean, renderer: Renderer2, cdkTableRef: ElementRef) {
    this.isColumnResizing = false;
    this.currentResizeIndex = -1;
    this.startX = event.pageX;
    this.checkIsResizing(event, index, cdkTableRef);
    this.pressed = true;
    if (enableColumnResize && this.isColumnResizing) {
      event.preventDefault();
      event.stopPropagation();
      this.mouseMove(index, renderer, cdkTableRef);
    }
  }

  private getCellData(index: number, cdkTableRef: ElementRef) {
    const headerRow = cdkTableRef.nativeElement.children[1]; // dnd is in 2nd row
    const cell = headerRow.children[index];
    if (cell) {
      return cell.getBoundingClientRect();
    }
  }

  private isColumnVisible(column: IccField): boolean {
    let visible = false;
    if (!column.hidden && column.itemConfig.hidden !== 'always') {
      visible = true;
    }
    return visible;
  }

  private checkIsResizing(event, index: number, cdkTableRef: ElementRef) {
    const cellData = this.getCellData(index, cdkTableRef);
    this.isResizingRight = false;
    if (Math.abs(event.pageX - cellData.right) < 20) {
      this.isColumnResizing = true;
      this.isResizingRight = true;
      this.currentResizeIndex = index;
    } else if (Math.abs(event.pageX - cellData.left) < 20) {
      this.isColumnResizing = true;
      this.currentResizeIndex = index - 1;
    }
    if (this.isColumnResizing) {
      if (this.visibleColumns[this.currentResizeIndex] &&
        this.visibleColumns[this.currentResizeIndex].fixedWidth === true) {
        this.isColumnResizing = false;
      } else {
        const resizeCellData = this.getCellData(this.currentResizeIndex, cdkTableRef);
        if (resizeCellData) {
          this.startWidth = resizeCellData.width;
        } else {
          this.isColumnResizing = false;
        }
      }
    }
  }

  private mouseMove(index: number, renderer: Renderer2, cdkTableRef: ElementRef) {
    const resizedColumn = this.visibleColumns[this.currentResizeIndex];
    this.resizableMousemove = renderer.listen(cdkTableRef.nativeElement, 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const resizeIndex = this.isResizingRight ? index : index - 1;
        const width = this.startWidth + event.pageX - this.startX;
        if (this.currentResizeIndex === resizeIndex && width > resizedColumn.minWidth) {
          this.resetColumnsWidth(resizedColumn, resizeIndex, width);
          this.setGroupHeaderColumnWidth();
        }
      }
    });
    this.resizableMouseup = renderer.listen(cdkTableRef.nativeElement, 'mouseup', (event) => {
      this.stopColumnResize(event);
    });
    this.resizableMouseleave = renderer.listen(cdkTableRef.nativeElement, 'mouseleave', event => {
      this.stopColumnResize(event);
    });
  }

  private stopColumnResize(event) {
    if (this.pressed && this.isColumnResizing) {
      event.preventDefault();
      event.stopPropagation();
      this.pressed = false;
      this.currentResizeIndex = -1;
      this.resizableMousemove();
      this.resizableMouseup();
      this.resizableMouseleave();
      setTimeout(() => {
        this.isColumnResized$.next(true);
        this.isColumnResizing = false;
      }, 10);
    }
  }

  private resetColumnsWidth(resizedColumn: IccField, index: number, width: number) {
    const orgWidth = resizedColumn.width;
    const dx = width - orgWidth;
    if (dx !== 0) {
      resizedColumn.width = width;
      if (this.isAllFlexColumns()) {
        this.adjustColumnsWidth(-dx, index);
      } else {
        this.tableWidth += dx;
        this.adjustStickyPosition(resizedColumn, index);
      }
    }
  }

  private adjustStickyPosition(column: IccField, resizeIndex: number) {
    if (column.sticky) {
      let leftX = 0;
      this.visibleColumns.forEach((col, index) => {
        if (index > resizeIndex) {
          col.left = `${leftX}px`;
        }
        leftX += col.width;
      });
    } else if (column.stickyEnd) {
      let rightX = 0;
      this.visibleColumns.slice().reverse().forEach((col, index) => {
        if (index > resizeIndex) {
          col.left = `${rightX}px`;
        }
        rightX += col.width;
      });
    }
  }

  private setGroupHeaderColumnWidth() {
    if (this.groupHeaderColumns.length < this.visibleColumns.length) {
      this.groupHeaderColumns.forEach(header => {
        const columns = this.visibleColumns.filter(column => {
          const groupname = column.groupHeader ? column.groupHeader.name : `group${column.name}`;
          return header.name === groupname;
        });
        if (columns.length > 0) {
          header.width = 0;
          columns.forEach((column, index) => {
            if (index === 0) {
              Object.assign(header, {
                left: column.left,
                right: column.right
              });
            }
            if (column.groupHeader && column.stickyEnd && index === columns.length - 1) {
              header.right = column.right;
            }
            header.width += column.width;
          });
        }
      });
    }
  }

  onDragStarted(event: CdkDragStart, index: number, visibleColumns, cdkTableRef: ElementRef) {
    this.previousIndex = index;
    this.cellData = [];
    visibleColumns.forEach((column, i) => {
      this.cellData.push(this.getCellData(i, cdkTableRef));
    });
  }

  onDragMoved(event, index, visibleColumns) {
    const dx = event.pointerPosition.x - this.startX;
    this.currentIndex = this.getOverCellIndex(event.pointerPosition.x, dx, index, visibleColumns);
  }

  // cdk drag drop cdkDropListExited does not provide event if exit back to drag item
  // cdk drag drop does not support variable column width
  // drag item over more than 2 columns are not considered
  // (cdkDropListEntered)="dropListEntered(i)"
  // (cdkDropListExited)="dropListExited($event, i)"
  private getOverCellIndex(x: number, dx: number, index: number, visibleColumns) {
    let i = -1;
    if (dx > 0) {
      const px = dx + this.cellData[index].right;
      for (i = index + 1; i < visibleColumns.length; i++) {
        const cellData = this.cellData[i];
        if (px > cellData.left && px <= cellData.right) {
          if (px - cellData.left > this.cellData[index].width / 2) {
            return i;
          } else {
            return i - 1;
          }
        } else if (px > cellData.right && i === visibleColumns.length - 1) {
          return visibleColumns.length - 1;
        }
      }
    } else if (dx < 0) {
      const mx = this.cellData[index].left + dx;
      for (i = index - 1; i >= 0; i--) {
        const cellDatam = this.cellData[i];
        if (mx < cellDatam.right && mx >= cellDatam.left) {
          if (cellDatam.right - mx > this.cellData[index].width / 2) {
            return i;
          } else {
            return i + 1;
          }
        } else if (mx < cellDatam.left && i === 0) {
          return i;
        }
      }
    }
    return i;
  }

  onDropListPredicate() {
    const me = this;
    if (!me.isColumnResizing) {
      return (drag: CdkDrag<number>): boolean => {
        const dragedColumn = this.visibleColumns[drag.data['columIndex']];
        return this.isColumnDroppable(dragedColumn, false);
      };
    }
  }

  private isColumnDroppable(dragedColumn: IccField, isDragGroupHeader: boolean): boolean {
    let droppable = false;
    if (this.currentIndex > -1) {
      const column = this.visibleColumns[this.currentIndex];
      if (!column.dragDisabled && !column.sticky && !column.stickyEnd && column.index !== dragedColumn.index) {
        if (dragedColumn.groupHeader) {
          if (column.groupHeader && dragedColumn.groupHeader.name === column.groupHeader.name) {
            droppable = true;
          } else if (isDragGroupHeader) {
            droppable = true;
          }
        } else {
          droppable = true;
        }
      }
    }
    return droppable;
  }

  isDropListDropped(event: CdkDragDrop<string[]>, visibleColumns, columns: IccField[]): boolean {
    this.pressed = false;
    if (event && this.currentIndex > -1 && !this.isColumnResizing) {
      let dragedColumn = visibleColumns[this.previousIndex];
      let column = visibleColumns[this.currentIndex];
      let colspan = 1;
      let currentcolspan = 1;
      let isDragGroupHeader = false;
      if (this.visibleColumns.length !== visibleColumns.length) {
        isDragGroupHeader = true;
        const dropedColumn = dragedColumn as IccGroupHeader;
        const currentColumn = column as IccGroupHeader;
        colspan = dropedColumn.colspan || 1;
        currentcolspan = currentColumn.colspan || 1;
        dragedColumn = this.visibleColumns[dragedColumn.index];
        column = this.visibleColumns[column.index];
      }
      if (this.isColumnDroppable(dragedColumn, isDragGroupHeader)) {
        const previousIndex = dragedColumn.index;
        let currentIndex = column.index;
        if (this.visibleColumns.length !== visibleColumns.length) {
          if (currentIndex > previousIndex) {
            currentIndex += currentcolspan - 1;
          }
          if (colspan === 1) {
            moveItemInArray(columns, previousIndex, currentIndex);
          } else {
            this.moveGroupItemInArray(columns, previousIndex, currentIndex, colspan);
          }
        } else {
          if (column.groupHeader) {
            if (currentIndex > previousIndex) {
              currentIndex = column.groupHeader.index + column.groupHeader.colspan - 1;
            } else if (currentIndex < previousIndex) {
              currentIndex = column.groupHeader.index;
            }
          }
          moveItemInArray(columns, previousIndex, currentIndex);
        }
        this.tableChange$.next({ changes: 'column' });
        return true;
      }
    }
  }

  private moveGroupItemInArray(columns: any[], previousIndex: number, currentIndex: number, colspan: number) {
    const moved = columns.filter(column => {
      if (column.index >= previousIndex && column.index < previousIndex + colspan) {
        return true;
      }
    });
    columns.splice(previousIndex, colspan);
    colspan--;
    if (currentIndex > previousIndex) {
      currentIndex -= colspan;
    }
    moved.forEach(item => {
      columns.splice(currentIndex, 0, item);
      currentIndex++;
    });
  }

  // TODO (1) Sticky right vertical scroll bar width need put into right X ??? unStickyEend issue???
  private setColumnSticky(columns: IccField[], tableConfigs: IccTableConfigs) {
    if (tableConfigs.enableColumnSticky && this.visibleColumns) {
      let stickyPosition = 0;
      let lastStickyIndex = 0;
      columns.forEach(column => {
        if (column.sticky) {
          if (column.index > lastStickyIndex) {
            moveItemInArray(columns, column.index, lastStickyIndex);
          }
          lastStickyIndex++;
          column.left = stickyPosition + 'px';
          if (!column.hidden && column.itemConfig.hidden !== 'always') {
            stickyPosition += column.width;
          }
        } else {
          column.left = 'auto';
        }
      });
      stickyPosition = 0;
      lastStickyIndex = columns.length - 1;
      columns.slice().reverse().forEach(column => {
        if (column.stickyEnd) {
          if (column.index < lastStickyIndex) {
            moveItemInArray(columns, column.index, lastStickyIndex);
          }
          lastStickyIndex--;
          column.right = stickyPosition + 'px';
          if (!column.hidden && column.itemConfig.hidden !== 'always') {
            stickyPosition += column.width;
          }
        } else {
          column.right = 'auto';
        }
      });
      this.setGroupHeaderSticky();
    }
  }

  columnStickyLeft(column: IccField, columns: IccField[]) {
    columns.filter(item => {
      return item.name === column.name || item.name === 'rowSelection' ||
        (column.groupHeader && item.groupHeader && column.groupHeader.name === item.groupHeader.name);
    })
      .forEach(item => {
        Object.assign(item, {
          sticky: true,
          stickyEnd: false,
          dragDisabled: true
        });
      });
    this.setGroupHeaderSticky();
    this.tableChange$.next({ changes: 'column' });
  }

  columnStickyRight(column: IccField, columns: IccField[]) {
    columns.filter(item => {
      return item.name === column.name ||
        (column.groupHeader && item.groupHeader && column.groupHeader.name === item.groupHeader.name);
    })
      .forEach(item => {
        Object.assign(item, {
          sticky: false,
          stickyEnd: true,
          dragDisabled: true
        });
      });
    this.checkRowSelectionSticky(columns);
    this.setGroupHeaderSticky();
    this.tableChange$.next({ changes: 'column' });
  }

  columnUnSticky(column: IccField, columns: IccField[], viewport: CdkVirtualScrollViewport, cdkTableRef: ElementRef) {
    if (column.stickyEnd) {
      this.resetColumnLeftBorder(column, viewport, cdkTableRef);
    }
    columns.filter(item => {
      return item.name === column.name ||
        (column.groupHeader && item.groupHeader && column.groupHeader.name === item.groupHeader.name);
    })
      .forEach((item: IccField) => {
        Object.assign(item, {
          sticky: false,
          stickyEnd: false,
          dragDisabled: item.itemConfig.dragDisabled
        });
      });
    this.checkRowSelectionSticky(columns);
    this.setGroupHeaderSticky();
    this.tableChange$.next({ changes: 'column' });
  }

  private checkRowSelectionSticky(columns: IccField[]) {
    const sticky = columns.filter(item => item.sticky && item.name !== 'rowSelection').length;
    if (sticky === 0) {
      const rowSelection = columns.filter(item => item.name === 'rowSelection');
      if (rowSelection.length > 0) {
        rowSelection[0].sticky = false;
      }
    }
  }

  // TODO for tree grid ???
  private getHeaderColumns(column: IccField, matTableRef: ElementRef): HTMLDivElement[] {
    const headerColumns: HTMLDivElement[] = Array.from(matTableRef.nativeElement.getElementsByClassName('cdk-column-' + column.name));
    let groupColumns: HTMLDivElement[] = [];
    if (column.groupHeader) {
      groupColumns = Array.from(matTableRef.nativeElement.getElementsByClassName('cdk-column-' + column.groupHeader.name));
    } else {
      groupColumns = Array.from(matTableRef.nativeElement.getElementsByClassName('cdk-column-group' + column.name));
    }
    return [...headerColumns.concat(groupColumns)];
  }

  public resetColumnLeftBorder(column: IccField, viewport: CdkVirtualScrollViewport, cdkTableRef: ElementRef) {
    if (column.groupHeader) {
      const cols = this.visibleColumns.filter(col => col.groupHeader && col.groupHeader.name === column.groupHeader.name);
      column = cols[0];
    }
    const headerColumns: HTMLDivElement[] = this.getHeaderColumns(column, cdkTableRef);
    headerColumns.forEach((element: HTMLDivElement) => {
      element.style.borderLeft = '';
    });
    const cellColumns = Array.from(viewport.elementRef.nativeElement.getElementsByClassName('cdk-column-' + column.name));
    cellColumns.forEach((element: HTMLDivElement) => {
      element.style.borderLeft = '';
    });
  }

  resetColumnsData() {
    this.visibleColumns = null;
    this.groupHeaderColumns = null;
    this.tableChange$.next({ changes: null });
    this.isColumnResized$.next(false);
    // this.isColumnResized$.complete(); // Don't turn off
  }
}

