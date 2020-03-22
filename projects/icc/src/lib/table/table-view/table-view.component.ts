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
import { IccDataSource } from '../../datasource/datasource';
import { DropInfo, IccTableConfigs } from '../../models';
import { IccField } from '../../items';


@Component({
  selector: 'icc-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class IccTableViewComponent<T> implements AfterViewInit, OnInit, OnChanges {
  @Input() tableConfigs: IccTableConfigs = {};
  @Input() columns: IccField[] = [];
  @Input() data: T[] = [];

  dataSource: IccDataSource<T>;
  dataSourceLength = 0;

  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];

  viewportBuffer = 5;
  isViewportReady = false;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  @Output() iccViewportEvent: EventEmitter<CdkVirtualScrollViewport> = new EventEmitter<CdkVirtualScrollViewport>();

  get tableWidth(): number {
    return this.visibleColumns.map(column => column.width).reduce((prev, curr) => prev + curr, 0);
  }

  constructor(
  ) {
  }

  ngOnInit() {
    this.setTableColumns();
    console.log('this.tableConfigs= ', this.tableConfigs)

  }

  ngAfterViewInit() {
  }


  protected setTableColumns() {
    this.checkTableConfigs();
    this.visibleColumns = this.columns;
    this.displayedColumns = this.visibleColumns.map(column => column.name);
  }

  private checkTableConfigs() {
    if (!this.tableConfigs.filteredValues) {
      this.tableConfigs.filteredValues = {};
    }
    if (!this.tableConfigs.rowHeight) {
      this.tableConfigs.rowHeight = 30;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableConfigs) {
      this.checkTableConfigs();
    }
    /*
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
    } */
  }

  nextBatch() {
    if (!this.isViewportReady) {
      this.isViewportReady = true;
      // this.setDefaultSort();
      this.iccViewportEvent.emit(this.viewport);
      this.initDataSource();
      // this.setGridPanelOffset();
    } else {
      /*
      this.previousSelectDataId = -1;
      const range = this.getViewportRange();
      if (range && range.end) {
        this.onNextPageEvent(range);
        this.setPageSummary();
      }
      this.columnsService.checkStickyColumns(this.viewport, this.matTableRef);
      */
    }
  }

  private initDataSource() {
    if (this.dataSource) {
      return;
    }
    // this.filters.update(this.gridConfigs.filteredValues);
    this.dataSource = new IccDataSource(this.viewport);

    //

    this.dataSourceLength = this.data.length;
    this.dataSource.data = [...this.data];
    // this.dataSource.loadRecords(this.data);
    /*
    this.dataSource.dataSourceService = this.dataSourceService;
    this.dataSourceService.queuedData = this.data;
    this.dataSourceService.totalRecords = this.data.length;
    this.subDataSourceService = this.dataSource.queryData$.pipe(map(data => {
      return data;
    }), distinctUntilChanged())
      .subscribe(data => this.dataRecordRefreshed(data));
    this.fetchRecords(); */

  }


  onViewportScroll(event: any) {
    this.tableConfigs.columnHeaderPosition = -event.target.scrollLeft;
  }
}

