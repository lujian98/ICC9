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
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share, switchMap, takeWhile } from 'rxjs/operators';
import { IccDataSource } from '../../datasource/datasource';
import { DropInfo, IccTableConfigs } from '../../models';
import { IccField } from '../../items';
import { IccDataSourceService } from '../../services/data-source.service';


@Component({
  selector: 'icc-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class IccTableViewComponent<T> implements AfterViewInit, OnInit, OnChanges {
  @Input() tableConfigs: IccTableConfigs = {};
  @Input() columns: IccField[] = [];
  @Input() dataSourceService: IccDataSourceService<T>;
  @Input() data: T[] = [];
  private alive = true;

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
      this.iccViewportEvent.emit(this.viewport);
      this.initDataSource();
    }
  }

  private initDataSource() {
    if (this.dataSource) {
      return;
    }
    this.dataSource = new IccDataSource(this.viewport);
    this.dataSourceLength = this.data.length;
    this.dataSource.loadRecords(this.data);
    this.dataSource.dataSourceService = this.dataSourceService;
    this.dataSourceService.queuedData = this.data;
    this.dataSourceService.totalRecords = this.data.length;
    this.dataSourceService.dataSourceChanged$.pipe(takeWhile(() => this.alive))
      .subscribe((data: T[]) => this.dataRecordRefreshed(data));
  }

  dataRecordRefreshed(data: T[]) {
    this.dataSourceLength = data.length;
  }


  onViewportScroll(event: any) {
    this.tableConfigs.columnHeaderPosition = -event.target.scrollLeft;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

