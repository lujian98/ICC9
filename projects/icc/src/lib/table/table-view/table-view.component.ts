import {
  AfterViewInit,
  Component,
  OnDestroy,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SelectionModel } from '@angular/cdk/collections';
import { delay, takeWhile } from 'rxjs/operators';
import { IccDataSource } from '../../datasource/datasource';
import { IccTableConfigs } from '../../models';
import { IccField } from '../../items';
import { IccDataSourceService } from '../../services/data-source.service';
import { IccTableEventService } from '../services/table-event.service';
import { IccRowGroup } from '../../services';
import { IccGroupByColumn } from '../../services/row-group/row-groups';

@Component({
  selector: 'icc-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class IccTableViewComponent<T> implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input() tableConfigs: IccTableConfigs = {};
  @Input() columns: IccField[] = [];
  @Input() data: T[] = [];
  private alive = true;

  dataSource: IccDataSource<T>;
  dataSourceLength = 0;

  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];

  groupByColumns: IccGroupByColumn[] = []; // TODO GridConfigs groupByColumns default value

  private selection: SelectionModel<T>;
  currentKeyEvent: MouseEvent; // for selection
  previousSelectDataId = -1;

  viewportBuffer = 5;
  private isViewportReady = false;
  @ViewChild(CdkVirtualScrollViewport) private viewport: CdkVirtualScrollViewport;

  get tableWidth(): number {
    return this.visibleColumns.map(column => column.width).reduce((prev, curr) => prev + curr, 0);
  }

  constructor(
    private dataSourceService: IccDataSourceService<T>,
    private tableEventService: IccTableEventService,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.tableEventService.tableEvent$.pipe(takeWhile(() => this.alive), delay(10))
      .subscribe((e: any) => {
        if (e.event) {
          if (e.event === 'column') {
            this.setTableColumns();
          } else if (e.event.selection) {
            this.selection = e.event.selection;
          } else if (e.event === 'selectAll') {
            this.selectAll();
          } else if (e.event.groupByColumns) {
            this.groupByColumns = e.event.groupByColumns;
          }
        }
      });
    this.setTableColumns();
  }

  ngAfterViewInit() {
  }

  private setTableColumns() {
    this.checkTableConfigs();
    this.visibleColumns = this.columns.filter(column => column.hidden !== 'always');
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

  ngOnChanges(changes: SimpleChanges) { // TODO warning is not working with directive
    this.setTableColumns();
  }

  nextBatch() {
    if (!this.isViewportReady) {
      this.isViewportReady = true;
      this.tableEventService.tableEvent$.next({ event: { viewport: this.viewport } });
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

  isGroup(index: number, item: IccRowGroup): boolean {
    return item.level ? true : false;
  }

  groupHeaderClick(group: IccRowGroup) {
    group.expanded = !group.expanded;
    this.tableEventService.tableEvent$.next({ event: { groupExpand: group } });
  }

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
        if (this.isRowSelected(record)) {
          this.selection.toggle(record);
        } else {
          this.setSelectionRange(this.previousSelectDataId, currentDataId);
        }
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
      // this.selectionEventEmit();
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

  private selectAll() {
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onViewportScroll(event: any) {
    this.tableConfigs.columnHeaderPosition = -event.target.scrollLeft;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

