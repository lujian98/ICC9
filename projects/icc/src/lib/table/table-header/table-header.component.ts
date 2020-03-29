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
import { IccColumnHeaderService } from '../services/column-header.service';


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
  @Input() selection: SelectionModel<T>;
  private alive = false;

  pending: boolean;
  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];
  filterColumns: string[] = [];
  groupHeaderColumns: IccGroupHeader[] = [];
  groupHeaderDisplay: string[] = [];

  tableWidth: number;
  isWindowReszie$: Subject<{}> = new Subject();

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

  constructor(
    private columnHeaderService: IccColumnHeaderService,
    private renderer: Renderer2,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.sorts.multiSort = this.tableConfigs.enableMultiColumnSort;
    // this.rowGroups.enableMultiRowGroup = this.gridConfigs.enableMultiRowGroup;

    this.isWindowReszie$.pipe(takeWhile(() => this.alive), debounceTime(250)).subscribe(() => this.setTableFullSize(1));
    this.columnHeaderService.isColumnResized$.pipe(takeWhile(() => this.alive)).subscribe((v) => this.setTableFullSize(1));
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
    this.columnHeaderService.setColumnChanges(this.columns, this.tableConfigs);
    this.visibleColumns = this.columnHeaderService.visibleColumns;
    this.groupHeaderColumns = this.columnHeaderService.groupHeaderColumns;
    this.setColumnsHide();
    this.displayedColumns = this.visibleColumns.map(column => column.name);
    this.filterColumns = this.visibleColumns.map(column => `filter${column.name}`);
    const totalVisibleColumns = this.visibleColumns.length;
    this.groupHeaderDisplay = [];
    if (this.groupHeaderColumns.length < totalVisibleColumns) {
      this.groupHeaderDisplay = this.groupHeaderColumns.map(header => header.name);
      this.columnHeaderService.setGroupHeaderSticky();
    }
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
        this.tableWidth = this.columnHeaderService.getTableWidth(viewportWidth);
        console.log(' set full size 8888888888888888888888888888tableWidth=', this.tableWidth, ' viewportWidth=', viewportWidth)
        // this.columnsService.checkStickyColumns(this.viewport, this.matTableRef);
      }
    }, delay);
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

  checkResizeORDnD(event: any, index: number) {
    this.columnHeaderService.checkResizeORDnD(event, index, this.cdkTableRef);
  }

  onResizeColumn(event: any, index: number) {
    this.columnHeaderService
      .onResizeColumn(event, index, this.tableConfigs.enableColumnResize, this.renderer, this.cdkTableRef);
  }

  onResizeHeaderColumn(event: any, index: number) {
    this.columnHeaderService
      .onResizeHeaderColumn(event, index, this.tableConfigs.enableColumnResize, this.renderer, this.cdkTableRef);
  }

  checkHeaderResizeORDnD(event: any, index: number) {
    this.columnHeaderService.checkHeaderResizeORDnD(event, index, this.cdkTableRef);
  }

  isDragDisabled(column: IccField): boolean {
    return !this.tableConfigs.enableColumnDnD || this.columnHeaderService.isColumnResizing || column.dragDisabled;
  }

  onDragStarted(event: CdkDragStart, index: number, visibleColumns) {
    this.columnHeaderService.onDragStarted(event, index, visibleColumns, this.cdkTableRef);
  }

  onDragMoved(event, index, visibleColumns) {
    this.columnHeaderService.onDragMoved(event, index, visibleColumns);
  }

  onDropListPredicate() {
    return this.columnHeaderService.onDropListPredicate();
  }

  onDropListDropped(event: CdkDragDrop<string[]>, visibleColumns) {
    if (this.columnHeaderService.isDropListDropped(event, visibleColumns, this.columns)) {
      this.setHeaderColumns();
      // this.scrollToPosition(0);
    }
  }

  onColumnMenuItemClick(menuItem: any, column: IccField) {
    const field = menuItem.field as IccField;
    console.log(' menu click', field)
    if (field.action === 'columnHideShow') {
      const col = this.columns.filter(item => item.name === field.name)[0];
      this.hideColumn(col, column);
    } else if (field.action === 'pinLeft') {
      this.columnHeaderService.columnStickyLeft(column, this.columns);
      this.setHeaderColumns();
    } else if (field.action === 'pinRight') {
      this.columnHeaderService.columnStickyRight(column, this.columns);
      this.setHeaderColumns();
    } else if (field.action === 'unpin') {
      this.columnHeaderService.columnUnSticky(column, this.columns, this.viewport, this.cdkTableRef);
      this.setHeaderColumns();
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    return true;
    // return numSelected >= numRows;
  }

  masterToggle() {
    // this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    // this.selectionEventEmit();
  }

  ngOnDestroy() {
    this.alive = false;
    this.columnHeaderService.resetColumnsData();
    this.isWindowReszie$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent) {
    this.isWindowReszie$.next(true);
  }
}

