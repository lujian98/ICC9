import { CdkDrag, CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { IccField } from '../../items';
import { IccGroupHeader } from '../../models';

@Injectable()
export class IccColumnResizeDnDService {
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
    this.tableWidth = this.isAllFlexColumns() ? viewportWidth : this.getTableSize();
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

  onResizeHeaderColumn(event: any, index: number, enableColumnResize: boolean, renderer: Renderer2, matTableRef: ElementRef) {
    let resizedColumnIndex = -1;
    this.visibleColumns.filter((column: IccField, i) => {
      const cellData = this.getCellData(i, matTableRef);
      if (cellData.x <= event.pageX && cellData.right > event.pageX) {
        resizedColumnIndex = i;
      }
    });
    if (resizedColumnIndex > -1) {
      this.onResizeColumn(event, resizedColumnIndex, enableColumnResize, renderer, matTableRef);
    }
  }

  onResizeColumn(event: any, index: number, enableColumnResize: boolean, renderer: Renderer2, matTableRef: ElementRef) {
    this.isColumnResizing = false;
    this.currentResizeIndex = -1;
    this.startX = event.pageX;
    this.checkIsResizing(event, index, matTableRef);
    if (enableColumnResize && this.isColumnResizing) {
      event.preventDefault();
      event.stopPropagation();
      this.pressed = true;
      this.mouseMove(index, renderer, matTableRef);
    }
  }

  private getCellData(index: number, matTableRef: ElementRef) {
    const headerRow = matTableRef.nativeElement.children[1];
    const cell = headerRow.children[index];
    if (cell) {
      return cell.getBoundingClientRect();
    }
  }

  private isColumnVisible(column: IccField): boolean {
    let visible = false;
    if (!column.hidden && column.itemConfig.hidden !== 'always') {
      visible = true;
      /* // TODO
      if (column.priority) {
        const elements = this.grid.elementRef.nativeElement.getElementsByClassName('icc-grid-column-priority-' + column.priority);
        if (elements && elements.length > 0) {
          const style = window.getComputedStyle(elements[0]);
          if (style && style.display === 'none') {
            visible = false;
          }
        }
      } */
    }
    return visible;
  }

  private checkIsResizing(event, index: number, matTableRef: ElementRef) {
    const cellData = this.getCellData(index, matTableRef);
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
        const resizeCellData = this.getCellData(this.currentResizeIndex, matTableRef);
        if (resizeCellData) {
          this.startWidth = resizeCellData.width;
        } else {
          this.isColumnResizing = false;
        }
      }
    }
  }

  private mouseMove(index: number, renderer: Renderer2, matTableRef: ElementRef) {
    const resizedColumn = this.visibleColumns[this.currentResizeIndex];
    this.resizableMousemove = renderer.listen(matTableRef.nativeElement, 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const resizeIndex = this.isResizingRight ? index : index - 1;
        const width = this.startWidth + event.pageX - this.startX;
        if (this.currentResizeIndex === resizeIndex && width > resizedColumn.minWidth) {
          this.resetColumnsWidth(resizedColumn, resizeIndex, width);
          this.setGroupHeaderColumnWidth();
        }
      }
    });
    this.resizableMouseup = renderer.listen(matTableRef.nativeElement, 'mouseup', (event) => {
      this.stopColumnResize(event);
    });
    this.resizableMouseleave = renderer.listen(matTableRef.nativeElement, 'mouseleave', event => {
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

  onDragStarted(event: CdkDragStart, index: number, visibleColumns, matTableRef: ElementRef) {
    this.previousIndex = index;
    this.cellData = [];
    visibleColumns.forEach((column, i) => {
      this.cellData.push(this.getCellData(i, matTableRef));
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

  onDropListPredicate(column: IccField) {
    const me = this;
    if (!me.isColumnResizing) {
      return (drag: CdkDrag<number>): boolean => {
        const dragedColumn = this.visibleColumns[drag.data['columIndex']];
        return this.isColumnDroppable(column, dragedColumn, false);
      };
    }
  }

  private isColumnDroppable(column: IccField, dragedColumn: IccField, isDragGroupHeader: boolean): boolean {
    let droppable = false;
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
    return droppable;
  }

  isDropListDropped(event: CdkDragDrop<string[]>, visibleColumns, columns: IccField[]): boolean {
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
      if (this.isColumnDroppable(column, dragedColumn, isDragGroupHeader)) {
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

  resetColumnsData() {
    this.visibleColumns = null;
    this.groupHeaderColumns = null;
    // this.isColumnResized$.complete(); // Don't turn off
  }
}

