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
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CdkDragStart, CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListRange, SelectionModel } from '@angular/cdk/collections';
import { MatTable } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share, switchMap } from 'rxjs/operators';
import { IccFilters } from '../../services/filter/filters';
import { IccSorts } from '../../services/sort/sorts';
import { ColumnMenuType, IccGroupHeader, IccColumnConfig } from '../../models';
import { IccLoadRecordParams } from '../../services/loadRecordParams.model';
import { IccPagination } from '../../services/pagination/pagination';
import { IccField } from '../../items';
import { IccGridConfigs } from '../../models';
import { IccMenuItem } from '../../menu/menu-item';
import { IccRowGroup } from '../../services';
import { IccRowGroups, IccGroupByColumn } from '../../services/row-group/row-groups';
import { IccBaseGridDataSource } from '../datasource/grid-datasource';
import { IccDataSourceService } from '../../services/data-source.service';
import { IccColumnsService } from '../services/columns.service';
import { IccGridStatesService } from '../services/grid-states.service';
import { IccColumnResizeDnDService } from '../services/column-resize-dnd.service';
import { IccCellEditData } from './cell-edit/cell-edit.service';
import { IccUtils } from '../../utils/utils';

@Component({
  selector: 'icc-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
  // providers: [
  //  { provide: IccGridViewComponent, useClass: forwardRef(() => IccGridViewComponent) }
  // ]
})
export class IccGridViewComponent<T> implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() gridConfigs: IccGridConfigs = {
    dataKeyId: 'deviceid',
    filteredValues: {},
    rowHeight: 30
  };
  @Input() columnConfigs: IccColumnConfig[];
  @Input() data: T[] = [];

  columns: IccField[] = [];
  dataSource: IccBaseGridDataSource<T>;
  totalRecords = 0;
  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];
  groupHeaderColumns: IccGroupHeader[] = [];
  groupHeaderDisplay: string[] = [];
  columnHeaderPosition = 0;

  pagination = new IccPagination();
  pageBuffer = 20;
  filters = new IccFilters();
  sorts = new IccSorts();
  rowGroups = new IccRowGroups();
  groupByColumns: IccGroupByColumn[] = []; // TODO GridConfigs groupByColumns default value
  selection: SelectionModel<T>;
  gridSideMenu: IccMenuItem; // TODO GridConfigs Side Menus

  pending: boolean;
  tableWidth: number;
  isWindowReszie$: Subject<{}> = new Subject();
  viewportBuffer = 5;
  gridSummary: string;
  viewportPageSize = 50;
  currentKeyEvent: MouseEvent;
  previousSelectDataId = -1;
  private currentScrollPosition = 0;

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  @ViewChild(MatTable, { read: ElementRef }) public matTableRef: ElementRef;
  @ViewChild(MatTable) table: MatTable<T>;
  @ViewChild(MatSort) sort: MatSort;

  private subDataSourceService: Subscription;
  private subIsColumnResized: Subscription;
  private subIsWindowReszie: Subscription;

  constructor(
    private columnsService: IccColumnsService,
    private columnResizeDnDService: IccColumnResizeDnDService,
    private dataSourceService: IccDataSourceService<T>,
    private gridStatesService: IccGridStatesService<T>,
    private renderer: Renderer2,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.sorts.multiSort = this.gridConfigs.enableMultiColumnSort;
    this.rowGroups.enableMultiRowGroup = this.gridConfigs.enableMultiRowGroup;
    this.subIsWindowReszie = this.isWindowReszie$.pipe(debounceTime(250)).subscribe(() => this.setGridPanelOffset());
    this.subIsColumnResized = this.columnResizeDnDService.isColumnResized$.subscribe((v) => this.setGridColumView());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gridConfigs) {
      if (!this.gridConfigs.dataKeyId) {
        this.gridConfigs.dataKeyId = 'deviceid';
      }
      if (!this.gridConfigs.filteredValues) {
        this.gridConfigs.filteredValues = {};
      }
      if (!this.gridConfigs.rowHeight) {
        this.gridConfigs.rowHeight = 30;
      }
    }
    if (changes.columnConfigs) {
      if (this.gridConfigs.enableMultiRowSelection) {
        this.gridConfigs.enableRowSelection = true;
      }
      if (this.gridConfigs.enableRowSelection) {
        this.columnsService.setupSelectionColumn(this.columnConfigs);
        this.selection = new SelectionModel<T>(this.gridConfigs.enableMultiRowSelection, []);
      }
      this.columns = this.columnsService.getInitialColumns(this.columnConfigs, this.gridConfigs);
      this.setGridColumView();
      this.filters.setFilters(this.columns);
    }
  }

  setGridColumView() {
    this.columnsService.setGridColumView(this.columns, this.gridConfigs);
    if (this.columnsService.isColumnsChanged) {
      this.visibleColumns = this.columnsService.visibleColumns;
      this.displayedColumns = this.columnsService.displayedColumns;
      this.groupHeaderColumns = this.columnsService.groupHeaderColumns;
      this.groupHeaderDisplay = this.columnsService.groupHeaderDisplay;
      this.columnResizeDnDService.visibleColumns = this.visibleColumns;
      this.columnResizeDnDService.groupHeaderColumns = this.groupHeaderColumns;
      this.setRightMenu();
    }
    this.setTableFullSize(10);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setDefaultSort();
      this.initDataSource();
      this.setGridPanelOffset();
    }, 10);
  }

  private setGridPanelOffset() {
    this.setTableFullSize(1);
    this.columnsService.checkColumnMenus(this.columns);
    this.setPageSummary();
  }

  private initDataSource() {
    if (this.dataSource) {
      return;
    }
    this.filters.update(this.gridConfigs.filteredValues);
    this.dataSource = new IccBaseGridDataSource();
    this.dataSource.viewport = this.viewport;
    this.dataSource.loadRecords(this.data);
    this.dataSource.dataSourceService = this.dataSourceService;
    this.dataSourceService.queuedData = this.data;
    this.dataSourceService.totalRecords = this.data.length;
    this.subDataSourceService = this.dataSource.queryData$.pipe(map(data => {
      return data;
    }), distinctUntilChanged())
      .subscribe(data => this.dataRecordRefreshed(data));
    this.fetchRecords();
    /* if (this.stateService) {
      this.loadGridStateService();
    } else {
      this.initLoadRecords();
    } */
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
      filters: this.filters,
      rowGroups: this.rowGroups
    };
  }

  dataRecordRefreshed(data: T[]) {
    this.totalRecords = this.dataSourceService.totalRecords + this.dataSourceService.totalRowGroups;
    this.pagination.total = this.totalRecords;
    this.setTableFullSize(5); // this is needed due to the vetical scroll bar show/hidden cause width change
    setTimeout(() => { // This is for refresh data animation
      this.pending = false;
      if (this.currentScrollPosition > 0) {
        this.scrollToPosition(this.currentScrollPosition);
        this.currentScrollPosition = 0;
      }
      // this.gridStates.setStates();
      this.setPageSummary();
    }, 250);
  }

  nextBatch() {
    this.previousSelectDataId = -1;
    const range = this.getViewportRange();
    if (range && range.end) {
      this.onNextPageEvent(range);
      this.setPageSummary();
    }
    this.columnsService.checkStickyColumns(this.viewport, this.matTableRef);
  }

  onNextPageEvent(range: ListRange) {
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
      if (this.pagination.isScrollPaging && (!this.pending || this.rowGroups.hasRowGroupCollapsed)) {
        if (this.isLoadNextPage(range.end)) {
          this.pending = true;
          this.fetchRecords();
        }
      }
    }
  }

  private isLoadNextPage(end: number): boolean {
    if (this.rowGroups.isRowGrouped) {
      end = this.rowGroups.getRowGroupScrollPosition(end);
    }
    return this.pagination.isLoadNextPage(end + this.pageBuffer);
  }

  getViewportRange(): ListRange {
    const range = this.viewport.getRenderedRange();
    let end = range.end < this.totalRecords ? range.end : this.totalRecords;
    const vierportRect = this.viewport.elementRef.nativeElement.getBoundingClientRect();
    const viewportRows = this.viewport.elementRef.nativeElement.getElementsByTagName('mat-row');
    let find = -1;
    if (viewportRows && viewportRows.length > 0) {
      for (let i = viewportRows.length - 1; i > 0; i--) {
        const rect = viewportRows[i].getBoundingClientRect();
        if ((rect.top + rect.height / 2) <= vierportRect.bottom) {
          find = i + 1;
          break;
        }
      }
    }
    if (find > 0) {
      end = range.start + find;
    }
    if (end >= this.totalRecords) {
      end = this.totalRecords;
    }
    let scrollOffset = this.viewport.measureScrollOffset();
    if (scrollOffset < this.gridConfigs.rowHeight) {
      scrollOffset = 0;
    }
    const index = Math.round(scrollOffset / this.gridConfigs.rowHeight);
    const start = Math.max(0, index) + 1;
    return { start: start, end: end };
  }

  setPageSummary() {
    const range: ListRange = this.getViewportRange();
    if (this.totalRecords > 0) {
      this.viewportPageSize = range.end - range.start + 1;
      this.gridSummary = 'Page Size: ' + this.viewportPageSize +
        ' Rows: ' + range.start + ' - ' + range.end + ' of ' + this.totalRecords;
    } else {
      this.gridSummary = 'No record found';
    }
  }

  isSortDisabled(column: IccField): boolean {
    return (!this.gridConfigs.enableColumnSort || !column.sortField || this.columnResizeDnDService.isColumnResizing) ? true : false;
  }

  sortData(event: MatSort) {
    this.setSortActive(event.active, event.direction);
    this.onGridHeaderSort(event);
  }

  onGridHeaderSort(sort: MatSort) {
    if (this.pagination.page > 1) {
      this.scrollToPosition(0);
    }
    if (this.groupByColumns.length > 0) {
      this.currentScrollPosition = this.viewport.elementRef.nativeElement.scrollTop;
    }
    this.sorts.isSorting = true;
    this.pending = true;
    this.resetDataSourceService();
    const column: IccField = IccUtils.findExactByKey(this.columns, 'name', sort.active);
    this.sorts.update(column, sort.active, sort.direction, sort.direction !== '');
    this.updateColumnSorts();
    if (!sort.direction) {
      this.setColumnMenuHidden(ColumnMenuType.RemoveSort, column);
    }
    if (column.sort) {
      column.sort.direction = sort.direction;
    }
    this.fetchRecords();
  }

  private setDefaultSort() {
    if (!this.gridConfigs.defaultSort) {
      this.gridConfigs.defaultSort = this.gridConfigs.dataKeyId;
    }
    this.sorts.removeSorts();
    const column: IccField = IccUtils.findExactByKey(this.columns, 'name', this.gridConfigs.defaultSort);
    if (column) {
      const dir = this.gridConfigs.defaultSortDir || 'desc';
      this.sorts.update(column, this.gridConfigs.defaultSort, dir, dir !== '');
      this.setSortActive(this.gridConfigs.defaultSort, dir as SortDirection);
      this.updateColumnSorts();
    }
  }

  updateColumnSorts() {
    const sortlist = this.sorts.sorts;
    if (sortlist && sortlist.length > 0) {
      sortlist.forEach((aSort, index) => {
        if (index === sortlist.length - 1) {
          aSort.active = true;
          this.setSortActive(aSort.key, aSort.direction as SortDirection);
        }
        const column: IccField = IccUtils.findExactByKey(this.columns, 'name', aSort.key);
        if (column) {
          column.sort = aSort;
        }
        const name = aSort.direction === 'asc' ? ColumnMenuType.SortAscending : ColumnMenuType.SortDescending;
        this.setColumnMenuHidden(name, column);
      });
    }
    if (!this.gridConfigs.enableMultiColumnSort) {
      this.columns.forEach((column: IccField) => {
        if (column.sort && !column.sort.active) {
          column.sort = null;
          this.setColumnMenuHidden(ColumnMenuType.RemoveSort, column);
        }
      });
    }
    this.sorts.setRowGroupSort(this.rowGroups.groupByColumns, this.columns);
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

  getColumnSortState(column: IccField): string {
    if (column.sort && !column.sort.active) {
      if (column.sort.direction === 'asc') {
        return 'fas fa-arrow-up';
      } else if (column.sort.direction === 'desc') {
        return 'fas fa-arrow-down';
      }
    }
  }

  onFilterChanged(event: T) {
    this.pending = true;
    this.pagination.page = 1;
    this.pagination.offset = 0;
    this.resetDataSourceService();
    this.filters.update(this.gridConfigs.filteredValues);
    this.fetchRecords();
    this.scrollToPosition(0);
  }

  onSaveCellEditValue(cellData: IccCellEditData<T>) {
    // this.iccSaveCellEditValueEvent.emit(cellData);
  }

  onCellEditSpecialKeyEvent(event) { // TODO enmu
    const rowIndex = event.rowIndex;
    const colIndex = event.colIndex;
    const keyCode = event.keyCode;
    const direction = event.direction;
    if (event.direction === 'up' || event.direction === 'down') {
      this.setCellEditUpDownKey(rowIndex, colIndex, keyCode, direction);
    } else if (event.direction === 'left') {
      this.setCellEditLeftKey(rowIndex + 1, colIndex - 1, keyCode, direction);
    } else if (event.direction === 'right') {
      this.setCellEditRightKey(rowIndex + 1, colIndex + 1, keyCode, direction);
    }
  }

  setCellEditLeftKey(rowIndex, colIndex, keyCode, direction) {
    let find = false;
    for (let i = colIndex; i >= 0; i--) {
      if (this.setCellEditUpDownKey(rowIndex, i, keyCode, 'exact')) {
        find = true;
        break;
      }
    }
    if (!find && rowIndex > 0) {
      if (rowIndex === 2) {
        this.scrollMoveItem(-1);
      }
      this.setCellEditLeftKey(rowIndex - 1, this.visibleColumns.length - 1, keyCode, direction);
    }
  }

  setCellEditRightKey(rowIndex, colIndex, keyCode, direction) {
    const length = this.visibleColumns.length;
    let find = false;
    for (let i = colIndex; i < length; i++) {
      if (this.setCellEditUpDownKey(rowIndex, i, keyCode, 'exact')) {
        find = true;
        break;
      }
    }
    if (!find && rowIndex <= this.viewportPageSize) {
      this.setCellEditRightKey(rowIndex + 1, 0, keyCode, direction);
      if (rowIndex + 1 === this.viewportPageSize) {
        this.scrollMoveItem(1);
      }
    }
  }

  setCellEditUpDownKey(rowIndex, colIndex, keyCode, direction) {
    const column = this.visibleColumns[colIndex];
    if (column.type === 'checkbox') {
      return;
    }
    const elements = Array.from(document.getElementsByClassName('mat-column-' + column.name));
    if (direction === 'down') {
      const length = Math.min(elements.length, this.viewportPageSize + 1);
      for (let i = rowIndex + 2; i < length; i++) {
        if (this.isInputElement(elements[i])) {
          if (i === this.viewportPageSize) {
            this.scrollMoveItem(1);
          }
          break;
        }
      }
    } else if (direction === 'up') {
      for (let i = rowIndex; i > 0; i--) {
        if (this.isInputElement(elements[i])) {
          if (i === 1) {
            this.scrollMoveItem(-1);
          }
          break;
        }
      }
    } else if (direction === 'exact') {
      return this.isInputElement(elements[rowIndex]);
    }
  }

  isInputElement(element): boolean {
    const inputEl = element.getElementsByTagName('input');
    if (inputEl && inputEl.length > 0) {
      inputEl[0].focus();
      return true;
    }
  }

  setTableFullSize(delay: number) {
    setTimeout(() => {
      if (this.viewport && this.matTableRef) {
        const viewportWidth = this.viewport.elementRef.nativeElement.clientWidth;
        this.tableWidth = this.columnResizeDnDService.getTableWidth(viewportWidth);
        this.columnsService.checkStickyColumns(this.viewport, this.matTableRef);
      }
    }, delay);
  }

  onResizeHeaderColumn(event: any, index: number) {
    this.columnResizeDnDService
      .onResizeHeaderColumn(event, index, this.gridConfigs.enableColumnResize, this.renderer, this.matTableRef);
  }

  onResizeColumn(event: any, index: number) {
    this.columnResizeDnDService
      .onResizeColumn(event, index, this.gridConfigs.enableColumnResize, this.renderer, this.matTableRef);
  }

  checkHeaderResizeORDnD(event: any, index: number) {
    this.columnResizeDnDService.checkHeaderResizeORDnD(event, index, this.matTableRef);
  }

  checkResizeORDnD(event: any, index: number) {
    this.columnResizeDnDService.checkResizeORDnD(event, index, this.matTableRef);
  }

  isDragDisabled(column: IccField): boolean {
    // console.log( ' this.isColumnResizing=', this.columnResizeDnDService.isColumnResizing )
    return !this.gridConfigs.enableColumnDnD || this.columnResizeDnDService.isColumnResizing || column.dragDisabled;
  }

  onDragStarted(event: CdkDragStart, index: number, visibleColumns) {
    this.columnResizeDnDService.onDragStarted(event, index, visibleColumns, this.matTableRef);
  }

  onDragMoved(event, index, visibleColumns) {
    this.columnResizeDnDService.onDragMoved(event, index, visibleColumns);
  }

  onDropListPredicate(column: IccField) {
    const me = this;
    return me.columnResizeDnDService.onDropListPredicate(column);
  }

  onDropListDropped(event: CdkDragDrop<string[]>, visibleColumns) {
    if (this.columnResizeDnDService.isDropListDropped(event, visibleColumns, this.columns)) {
      this.setGridColumView();
      this.scrollToPosition(0);
    }
  }

  setRightMenu() {
    if (this.gridConfigs.enableColumnHide) {
      this.gridConfigs.enableGridSideMenu = true;
    }
    if (this.gridConfigs.enableGridSideMenu) {
      const sideMenu = [];
      sideMenu.push({ type: 'button', title: 'Refresh', name: 'Refresh', icon: 'fas fa-sync-alt' });
      if (this.gridConfigs.enableColumnFilter) {
        sideMenu.push({ type: 'button', title: 'Clear', name: 'Clear', icon: 'fas fa-times-circle' });
      }
      if (this.gridConfigs.enableColumnHide) {
        const columns = this.columns.filter(column =>
          column.itemConfig.hidden !== 'always' && column.itemConfig.hidden !== 'never');
        sideMenu.push({ type: 'checkbox', name: 'hideShowColumns', options: columns });
      }
      this.gridSideMenu = {
        type: 'menu',
        icon: 'fas fa-ellipsis-v',
        children: sideMenu
      };
    }
  }

  onGridSideMenuClick(option: IccMenuItem) {
    if (option instanceof IccField) {
      this.hideColumn(option);
    } else {
      // this.iccGridRightMenuClickEvent.emit(option);
    }
  }

  hideColumn(column: IccField) {
    if (column.itemConfig.hidden !== 'always') {
      column.hidden = !column.hidden;
      this.setGridColumView();
    }
  }

  onColumnMenuClick(option: IccMenuItem, column: IccField) {
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
  }

  private setColumnMenuHidden(name: string, column: IccField) {
    this.columnsService.setColumnMenuHidden(name, column);
  }

  private sortColumn(column: IccField, direction: string) {
    const sort = {
      active: column.name,
      direction: direction
    } as MatSort;
    this.sortData(sort);
  }

  cellMenuClick($event, column: IccField, rowIndex: number, record) {
  }

  groupBy(column: IccField) {
    this.onGridRowGroupEvent(column, true);
    this.groupByColumns = this.rowGroups.groupByColumns;
    this.scrollToPosition(0);
  }

  onGridRowGroupEvent(column: IccField, addgroup: boolean) {
    this.setRowGroup(column, addgroup);
    this.fetchRecords();
  }

  private setRowGroup(column: IccField, addgroup: boolean) {
    this.resetDataSourceService();
    this.pagination.page = 1;
    this.updateRowGroupMenu();
    this.sorts.removeOtherSortKey(this.rowGroups.groupByColumns);
    this.rowGroups.setRowGrouping(column, addgroup);
    this.sorts.setRowGroupSort(this.rowGroups.groupByColumns, this.columns);
    if (column) {
      this.setColumnMenuHidden('groupBy', column as IccField);
    }
  }

  private updateRowGroupMenu() {
    this.rowGroups.groupByColumns.forEach((group: IccGroupByColumn) => {
      const column: IccField = IccUtils.findExactByKey(this.columns, 'name', group.column);
      if (column) {
        // this.setColumnMenuHidden('unGroupBy', column);
      }
    });
  }

  unGroupBy(column: IccField) {
    this.onGridRowGroupEvent(column, false);
    this.groupByColumns = this.rowGroups.groupByColumns;
    this.scrollToPosition(0);
  }

  groupHeaderClick(group: IccRowGroup) {
    group.expanded = !group.expanded;
    this.rowGroups.setRowGroupExpand(group);
    this.fetchRecords();
    if (!group.expanded) {
      this.nextBatch(); // This is need check if row collapse require to pull next page
    }
  }

  isGroup(index: number, item: IccRowGroup): boolean {
    return item.level ? true : false;
  }


  /*
  groupByFieldName(group: IccRowGroup): string {
    const groupColumn = this.groupByColumns[group.level - 1];
    const column = this.columns.filter(item => item.name === groupColumn);
    if (column && column.length > 0) {
      return column[0].title;
    } */

  groupByFieldName(group: IccRowGroup): string {
    const groupColumn: IccGroupByColumn = this.groupByColumns[group.level - 1];
    if (groupColumn) {
      const column = this.columns.filter(item => item.name === groupColumn.column);
      if (column && column.length > 0) {
        return column[0].title;
      }
    }
  }

  groupByFieldValue(group: IccRowGroup): string {
    const groupColumn: IccGroupByColumn = this.groupByColumns[group.level - 1];
    if (groupColumn) {
      if (groupColumn.column === groupColumn.field) {
        return group[group.field];
      } else {
        return group.value;
      }
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected >= numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this.selectionEventEmit();
  }

  selectionEventEmit() {
    if (this.selection && this.selection.selected.length === 0) {
      this.previousSelectDataId = -1;
    }
  }

  // Material bug: must use the checkboxClick event and checkboxChange event to get correct select row state
  checkboxClick(event: MouseEvent) {
    this.currentKeyEvent = event;
    if (!((event.shiftKey || event.ctrlKey || event.metaKey) && this.platform.FIREFOX)) {
      event.stopPropagation();
    }
  }

  checkboxChange(event, rowIndex: number, record: T, column) {
    if (column.name === 'rowSelection') {
      this.rowClick(this.currentKeyEvent, rowIndex, record);
    }
  }

  isRowSelected(record: T): boolean {
    if (this.selection && this.selection.isSelected(record)) {
      return true;
    }
  }

  rowClick(event: MouseEvent, rowIndex: number, record: T) {
    if (this.selection) {
      const range = this.viewport.getRenderedRange();
      const currentDataId = range.start + rowIndex;
      if (event.shiftKey) {
        this.setSelectionRange(this.previousSelectDataId, currentDataId);
      } else {
        if (!event.ctrlKey && !event.metaKey) {
          const isRowSelected = this.isRowSelected(record);
          this.selection.clear();
          if (isRowSelected) {
            this.selection.toggle(record);
          }
        }
        this.selection.toggle(record);
      }
      this.previousSelectDataId = currentDataId;
      this.selectionEventEmit();
      const elements = Array.from(document.getElementsByClassName('mat-column-rowSelection'));
      if (elements && elements.length > 0) {
        this.isInputElement(elements[rowIndex + 1]); // focus check box make sure value binding
      }
    }
  }

  setSelectionRange(previuosDataId: number, currentDataId: number) {
    const currentRecord = this.dataSource.data[currentDataId];
    const isCurrentSelected = this.isRowSelected(currentRecord);
    if (previuosDataId < 0) {
      previuosDataId = currentDataId;
    }
    if (previuosDataId > currentDataId) {
      const t = previuosDataId;
      previuosDataId = currentDataId;
      currentDataId = t;
    }
    for (let i = previuosDataId; i <= currentDataId; i++) {
      const row = this.dataSource.data[i];
      this.selection.select(row);
    }
    if (isCurrentSelected) {
      this.selection.deselect(currentRecord);
    }
  }

  scrollToPosition(top: number) {
    if (top < 0) {
      top = 0;
    }
    if (this.viewport && top >= 0) {
      this.viewport.elementRef.nativeElement.scrollTop = top;
    }
  }

  scrollMoveItem(row: number) {
    const top = row * this.gridConfigs.rowHeight + this.viewport.elementRef.nativeElement.scrollTop;
    this.scrollToPosition(top);
  }

  onViewportScroll(event: any) {
    this.columnHeaderPosition = -event.target.scrollLeft;
  }

  ngOnDestroy() {
    this.columnsService.resetColumnsData();
    this.columnResizeDnDService.resetColumnsData();
    if (this.subDataSourceService) {
      this.subDataSourceService.unsubscribe();
    }
    if (this.subIsWindowReszie) {
      this.subIsWindowReszie.unsubscribe();
    }
    if (this.subIsColumnResized) {
      this.subIsColumnResized.unsubscribe();
    }
    this.isWindowReszie$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent) {
    this.isWindowReszie$.next(true);
  }
}

