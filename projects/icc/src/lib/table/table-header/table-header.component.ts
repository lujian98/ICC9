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
import { ListRange, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share, switchMap, takeWhile } from 'rxjs/operators';
import { MatSort, SortDirection } from '@angular/material/sort';
import { IccField } from '../../items';
import { IccTableConfigs, IccGroupHeader } from '../../models';
import { IccSorts } from '../../services/sort/sorts';
import { IccDataSourceService } from '../../services/data-source.service';
import { IccLoadRecordParams } from '../../services/loadRecordParams.model';
import { IccRowGroup } from '../../services';
import { IccRowGroups, IccGroupByColumn } from '../../services/row-group/row-groups';
import { IccMenuItem } from '../../menu/menu-item';
import { IccPagination } from '../../services/pagination/pagination';

export interface IccSortState {
  name: string;
  direction?: string;
}

@Component({
  selector: 'icc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class IccTableHeaderComponent<T> implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() columns: IccField[] = [];
  @Input() tableConfigs: IccTableConfigs;
  @Input() viewport: CdkVirtualScrollViewport;
  @Input() dataSourceService: IccDataSourceService<T>;
  private alive = false;

  pending: boolean;
  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];
  filterColumns: string[] = [];
  groupHeaderColumns: IccGroupHeader[] = [];

  tableWidth: number;

  private isColumnResizing: boolean;

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

  sorts = new IccSorts();
  private hoverHeader: string;
  pagination = new IccPagination();
  pageBuffer = 20;
  totalRecords = 0;
  rowGroups = new IccRowGroups();
  groupByColumns: IccGroupByColumn[] = []; // TODO GridConfigs groupByColumns default value

  @ViewChild(CdkTable, { read: ElementRef }) public cdkTableRef: ElementRef;
  @ViewChild(CdkTable) table: CdkTable<T>;
  @ViewChild(MatSort) sort: MatSort;

  @Output() iccColumnsChangeEvent: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(
    private renderer: Renderer2,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.sorts.multiSort = this.tableConfigs.enableMultiColumnSort;
    // this.rowGroups.enableMultiRowGroup = this.gridConfigs.enableMultiRowGroup;
  }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      this.setHeaderColumns();
    }
    if (changes.viewport && this.viewport) {
      this.setTableFullSize(1);
      this.initDataSourceService();
    }
  }


  protected setHeaderColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
    });
    this.setColumnsHide();
    this.visibleColumns = this.columns.filter(column => column.hidden !== 'always');
    this.displayedColumns = this.visibleColumns.map(column => column.name);
    this.filterColumns = this.visibleColumns.map(column => `filter${column.name}`);
  }

  private initDataSourceService() {
    if (!this.alive) {
      this.alive = true;
      this.dataSourceService.dataSourceChanged$.pipe(takeWhile(() => this.alive))
        .subscribe((data: T[]) => this.dataRecordRefreshed(data));
      this.viewport.scrolledIndexChange.pipe(takeWhile(() => this.alive)).subscribe(index => {
        // console.log( ' table header track viewport scroll index 00000000000000000')
        const range = this.getViewportRange();
        if (range && range.end) {
          this.onNextPageEvent(range);
          // this.setPageSummary();
        }
      });
      this.fetchRecords();
    }
  }

  getViewportRange(): ListRange { // TODO correct range???
    const range = this.viewport.getRenderedRange();
    return range;
  }

  onNextPageEvent(range: ListRange) {
    if (this.pagination.isScrollPaging && (!this.pending || this.rowGroups.hasRowGroupCollapsed)) {
      if (this.isLoadNextPage(range.end)) {
        this.pending = true;
        this.fetchRecords();
      }
    }
  }

  private isLoadNextPage(end: number): boolean {
    if (this.rowGroups.isRowGrouped) {
      end = this.rowGroups.getRowGroupScrollPosition(end);
    }
    return this.pagination.isLoadNextPage(end + this.pageBuffer);
  }


  private fetchRecords() {
    const loadParams: IccLoadRecordParams = this.getLoadRecordParams();
    this.dataSourceService.requestParamsChanged$.next(loadParams);
  }

  resetDataSourceService() {
    if (this.dataSourceService) {
      this.dataSourceService.resetDataSourceService(this.getLoadRecordParams());
    }
  }

  getLoadRecordParams(): IccLoadRecordParams {
    return {
      pagination: this.pagination,
      sorts: this.sorts,
      // filters: this.filters,
      rowGroups: this.rowGroups
    };
  }

  dataRecordRefreshed(data: T[]) { // TODO this also will in the table view????
    console.log(' refrsh data iiiiiiiiiiiiiiiiiiiiiiiiii')
    this.totalRecords = this.dataSourceService.totalRecords + this.dataSourceService.totalRowGroups;
    this.pagination.total = this.totalRecords;


    this.setTableFullSize(5); // this is needed due to the vetical scroll bar show/hidden cause width change
    setTimeout(() => { // This is for refresh data animation
      this.pending = false;
      // if (this.currentScrollPosition > 0) {
      //   this.scrollToPosition(this.currentScrollPosition);
      //  this.currentScrollPosition = 0;
      // }
      // this.gridStates.setStates();
      //this.setPageSummary();
    }, 250);
  }

  setTableFullSize(delay: number) {
    setTimeout(() => {
      if (this.viewport && this.cdkTableRef) {
        const viewportWidth = this.viewport.elementRef.nativeElement.clientWidth;
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
    const newTableWidth = this.getTableSize();
    this.tableWidth = this.isAllFlexColumns() && newTableWidth > viewportWidth ? viewportWidth : newTableWidth;
    this.viewportWidth = viewportWidth;
    this.allowChangeFlexWidth = this.tableWidth <= viewportWidth;
    return this.tableWidth;
  }

  private setColumnsHide(colName: string = null) {
    if (this.tableConfigs.enableColumnHide) {
      const columnsHideShow: IccMenuItem = {
        title: 'Columns',
        name: 'columns',
        children: this.columns.map((column: IccField) => {
          return {
            type: 'checkbox',
            title: column.title,
            name: column.name,
            action: 'columnHideShow',
            checked: !column.hidden
          };
        })
      };
      this.columns.forEach(column => {
        if (column.hidden !== 'always' && column.menu && column.menu !== true && column.name !== colName) {
          const menu = JSON.parse(JSON.stringify(column.menu));
          const menus = column.menu.children ? menu.children.filter(item => item.name !== 'columns') : [];
          menus.push(columnsHideShow);
          menu.children = [];
          menu.children = [...menus];
          column.menu = menu;
        }
      });
    }
  }

  isHeaderSortable(column: IccField): boolean { // TODO check resizeing and drag and drop still need here???
    return (!this.tableConfigs.enableColumnSort || !column.sortField) ? false : true;
  }

  onHeaderSort(column: IccField) {
    if (this.isHeaderSortable(column)) {
      let direction = 'asc';
      if (column.sort) {
        direction = column.sort.direction === 'asc' ? 'desc' : '';
      }
      const sort = {
        name: column.name,
        direction: direction
      };
      this.onColumnSortData(column, sort);
    }
  }

  onColumnSortData(column: IccField, sort: IccSortState) {
    /*
    if (this.pagination.page > 1) {
      this.scrollToPosition(0);
    }
    if (this.groupByColumns.length > 0) {
      this.currentScrollPosition = this.viewport.elementRef.nativeElement.scrollTop;
    } */
    this.sorts.isSorting = true;
    this.pending = true;
    // this.resetDataSourceService();
    this.sorts.update(column, sort.name, sort.direction, sort.direction !== '');

    /*
    this.updateColumnSorts();
    if (!sort.direction) {
      this.setColumnMenuHidden(ColumnMenuType.RemoveSort, column);
    }
    if (column.sort) {
      column.sort.direction = sort.direction;
    }
    */
    this.fetchRecords();
    this.sorts.setRowGroupSort(this.rowGroups.groupByColumns, this.columns);
  }

  setSortState(column: IccField, hover: boolean) {
    this.hoverHeader = hover ? column.name : '';
  }

  getHeaderSortState(column: IccField): string {
    let ret = '';
    if (this.isHeaderSortable(column)) {
      if (column.sort) {
        ret = column.sort.direction === 'asc' ? 'fas fa-caret-up' : 'fas fa-caret-down';
        if (column.sort.active) {
          ret += ' orange';
        }
      } else if (column.name === this.hoverHeader) {
        ret = 'fas fa-caret-up blue';
      }
    }
    return ret;
  }

  private getTableSize(): number {
    let width = 0;
    this.visibleColumns.forEach(column => {
      if (this.isColumnVisible(column)) {
        width += column.width;
      }
    });
    console.log(' table width =', width)
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
    if (column && !column.hidden && column.itemConfig.hidden !== 'always') {
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
    this.isColumnResizing = false;
    this.currentResizeIndex = -1;
    this.startX = event.pageX;
    this.checkIsResizing(event, index);
    this.pressed = true;
    if (this.tableConfigs.enableColumnResize && this.isColumnResizing) {
      event.preventDefault();
      event.stopPropagation();
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
    return !this.tableConfigs.enableColumnDnD || this.isColumnResizing || (column && column.dragDisabled); //  || column.dragDisabled
  }

  onDragStarted(event: CdkDragStart, index: number, visibleColumns) {
    this.previousIndex = index;
    this.cellData = [];
    visibleColumns.forEach((column, i) => {
      this.cellData.push(this.getCellData(i));
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

  onDropListDropped(event: CdkDragDrop<string[]>, visibleColumns) {
    this.pressed = false;
    if (this.isDropListDropped(event, visibleColumns, this.columns)) {
      this.setHeaderColumns();
      this.iccColumnsChangeEvent.emit(this.displayedColumns);
    }
  }

  isDropListDropped(event: CdkDragDrop<string[]>, visibleColumns, columns) {
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

  onColumnMenuItemClick(menuItem: any, column: IccField) {
    console.log(' table header xxx menuItem=', menuItem);
    const field = menuItem.field as IccField;
    if (field.action === 'columnHideShow') {
      const col = this.columns.filter(item => item.name === field.name)[0];
      console.log(' hhhhhhhhhhhh col=', col)
      this.hideColumn(col, column);
    }
    /*
    if (option.name === ColumnMenuType.SortAscending) {
      this.sortColumn(column, 'asc');
    } else if (option.name === ColumnMenuType.SortDescending) {
      this.sortColumn(column, 'desc');
    } else if (option.name === ColumnMenuType.RemoveSort) {
      column.sort.active = false;
      this.sort.direction = '';
      column.sort.direction = '';
      this.sortColumn(column, '');
    } else if (option.name === 'hideColumn') {
      this.hideColumn(column);
    } else if (option.name === 'groupBy') {
      this.groupBy(column);
    } else if (option.name === 'unGroupBy') {
      this.unGroupBy(column);
    } else if (option.action === 'pinLeft') {
      this.columnsService.columnStickyLeft(column, this.columns);
      this.setGridColumView();
    } else if (option.action === 'pinRight') {
      this.columnsService.columnStickyRight(column, this.columns);
      this.setGridColumView();
    } else if (option.action === 'unpin') {
      this.columnsService.columnUnSticky(column, this.columns, this.viewport, this.matTableRef);
      this.setGridColumView();
    }
    this.setColumnMenuHidden(option.name, column);
    */
  }

  hideColumn(col: IccField, column: IccField) { // TODO set other column menu
    if (col.itemConfig.hidden !== 'always') {
      col.hidden = !col.hidden;
      this.setTableFullSize(5);
      // this.setGridColumView();
      // this.setColumnsMenu(column);
      this.setColumnsHide(column.name);
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTableFullSize(5);
    // this.setGridPanelOffset();
  }
}

