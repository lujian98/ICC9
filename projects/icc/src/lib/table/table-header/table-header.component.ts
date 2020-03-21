import {
  AfterViewInit,
  Component,
  OnDestroy,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { CdkDragStart, CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkTable } from '@angular/cdk/table';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatSort, SortDirection } from '@angular/material/sort';
import { IccField } from '../../items';
import { IccTableConfigs, IccGroupHeader } from '../../models';

@Component({
  selector: 'icc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class IccTableHeaderComponent<T> implements OnChanges, AfterViewInit {
  @Input() columns: IccField[] = [];
  @Input() tableConfigs: IccTableConfigs;
  @Input() viewport: CdkVirtualScrollViewport;

  pending: boolean; // TODO input or connect width view
  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];
  groupHeaderColumns: IccGroupHeader[] = [];

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

  // isColumnResized$: Subject<{}> = new Subject();


  @ViewChild(CdkTable, { read: ElementRef }) public cdkTableRef: ElementRef;
  @ViewChild(CdkTable) table: CdkTable<T>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private renderer: Renderer2,
    private platform: Platform,
  ) { }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      this.setHeaderColumns();
    }

    if (changes.viewport && this.viewport) {
      this.setTableFullSize(1);
      console.log(' 7777777777777777777777777 viewport=', this.viewport);
    }

  }

  setTableFullSize(delay: number) {
    setTimeout(() => {
      if (this.viewport && this.cdkTableRef) {
        const viewportWidth = this.viewport.elementRef.nativeElement.clientWidth;
        console.log( ' viewportWidth =', viewportWidth )
        this.tableWidth = this.getTableWidth(viewportWidth);
        // this.columnsService.checkStickyColumns(this.viewport, this.matTableRef);
      }
    }, delay);
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
    this.tableWidth = this.isAllFlexColumns() ? viewportWidth : this.getTableSize();
    this.viewportWidth = viewportWidth;
    this.allowChangeFlexWidth = this.tableWidth <= viewportWidth;
    return this.tableWidth;
  }

  protected setHeaderColumns() {
    this.visibleColumns = this.columns;
    this.displayedColumns = this.visibleColumns.map(column => column.name);
  }

  sortData(event: MatSort) {
    console.log(' sort mmmmmmmmmmmmm', event)
    this.setSortActive(event.active, event.direction);
    // this.onGridHeaderSort(event);
  }

  isSortDisabled(column: IccField): boolean {
    return false;
    // return (!this.tableConfigs.enableColumnSort || !column.sortField || this.isColumnResizing) ? true : false;
  }

  getColumnSortState(column: IccField): string {
    if (column.sort && !column.sort.active) {
      if (column.sort.direction === 'asc') {
        return 'fas fa-arrow-up';
      } else if (column.sort.direction === 'desc') {
        return 'fas fa-arrow-down';
      }
    }
  }

  setSortActive(field: string, direction: SortDirection) {
    if (direction) {
      this.sort.active = field;
      this.sort.direction = direction;
    } else if (this.sort.active === field) {
      this.sort.active = null;
    }
    this.sort._stateChanges.next();
  }




  onDropListPredicate() {
    const me = this;
    return true;
    // return me.columnResizeDnDService.onDropListPredicate();
  }

  onDropListDropped(event: CdkDragDrop<string[]>, visibleColumns) {
    console.log(' drop llllllllllll')
    // if (this.columnResizeDnDService.isDropListDropped(event, visibleColumns, this.columns)) {
    //  this.setGridColumView();
    //  this.scrollToPosition(0);
    // }
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

  private getResizedColumnIndex(event): number {
    let resizedColumnIndex = -1;
    this.visibleColumns.filter((column: IccField, i) => {
      const cellData = this.getCellData(i);
      if (cellData.x <= event.pageX && cellData.right > event.pageX) {
        resizedColumnIndex = i;
      }
    });
    return resizedColumnIndex;
  }

  onResizeHeaderColumn(event: any, index: number) {
    const resizedColumnIndex = this.getResizedColumnIndex(event);
    if (resizedColumnIndex > -1) {
      this.onResizeColumn(event, resizedColumnIndex);
    }
  }

  checkHeaderResizeORDnD(event: any, index: number) {
    const resizedColumnIndex = this.getResizedColumnIndex(event);
    this.checkResizeORDnD(event, resizedColumnIndex);
  }

  checkResizeORDnD(event: any, index: number) {
    if (!this.pressed) {
      this.isColumnResizing = false;
      this.checkIsResizing(event, index);
    }
  }

  private getCellData(index: number) {
    const headerRow = this.cdkTableRef.nativeElement.children[0]; // TODO if add header group
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

  private checkIsResizing(event, index: number) {
    const cellData = this.getCellData(index);
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
        const resizeCellData = this.getCellData(this.currentResizeIndex);
        if (resizeCellData) {
          this.startWidth = resizeCellData.width;
        } else {
          this.isColumnResizing = false;
        }
      }
    }
  }

  onResizeColumn(event: any, index: number) {
    // this.columnResizeDnDService
    //  .onResizeColumn(event, index, this.gridConfigs.enableColumnResize, this.renderer, this.matTableRef);
    this.isColumnResizing = false;
    this.currentResizeIndex = -1;
    this.startX = event.pageX;
    this.checkIsResizing(event, index);
    // if (this.tableConfigs.enableColumnResize && this.isColumnResizing) {
    if (this.isColumnResizing) {
      event.preventDefault();
      event.stopPropagation();
      this.pressed = true;
      this.mouseMove(index);
    }
  }

  private mouseMove(index: number) {
    const resizedColumn = this.visibleColumns[this.currentResizeIndex];
    this.resizableMousemove = this.renderer.listen(this.cdkTableRef.nativeElement, 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const resizeIndex = this.isResizingRight ? index : index - 1;
        const width = this.startWidth + event.pageX - this.startX;
        if (this.currentResizeIndex === resizeIndex && width > resizedColumn.minWidth) {
          this.resetColumnsWidth(resizedColumn, resizeIndex, width);
          this.setGroupHeaderColumnWidth();
        }
      }
    });
    this.resizableMouseup = this.renderer.listen(this.cdkTableRef.nativeElement, 'mouseup', (event) => {
      this.stopColumnResize(event);
    });
    this.resizableMouseleave = this.renderer.listen(this.cdkTableRef.nativeElement, 'mouseleave', event => {
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
        // this.isColumnResized$.next(true);
        this.isColumnResizing = false;
      }, 10);
    }
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

  isDragDisabled(column: IccField): boolean {
    return true;
    // return false;
    // console.log( ' this.isColumnResizing=', this.columnResizeDnDService.isColumnResizing )
    // return !this.gridConfigs.enableColumnDnD || this.columnResizeDnDService.isColumnResizing || column.dragDisabled;
  }

  onDragStarted(event: CdkDragStart, index: number, visibleColumns) {
    // this.columnResizeDnDService.onDragStarted(event, index, visibleColumns, this.matTableRef);
  }

  onDragMoved(event, index, visibleColumns) {
    // this.columnResizeDnDService.onDragMoved(event, index, visibleColumns);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTableFullSize(5);
    // this.setGridPanelOffset();
  }
}

