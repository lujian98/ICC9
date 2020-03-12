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

import { CdkDragStart, CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { IccField } from '../../items';
import { IccTableConfigs } from '../../models';

@Component({
  selector: 'icc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class IccTableHeaderComponent<T> implements OnChanges, AfterViewInit {
  @Input() columns: IccField[] = [];
  @Input() tableConfigs: IccTableConfigs;
  @Input() increaseWidth: boolean;
  @Input() descreaseWidth: boolean;

  pending: boolean; // TODO input or connect width view
  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];

  isColumnResizing: boolean;

  @ViewChild(MatTable, { read: ElementRef }) public matTableRef: ElementRef;
  @ViewChild(MatTable) table: MatTable<T>;
  @ViewChild(MatSort) sort: MatSort;

  get tableWidth(): number {
    return this.visibleColumns.map(column => column.width).reduce((prev, curr) => prev + curr, 0);
  }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      this.setHeaderColumns();
    }
    if (changes.increaseWidth && !changes.increaseWidth.firstChange) {
      this.visibleColumns[1].width += 10;
    } else if (changes.descreaseWidth && !changes.descreaseWidth.firstChange) {
      this.visibleColumns[1].width -= 10;
    }
  }

  protected setHeaderColumns() {
    this.visibleColumns = this.columns;
    this.displayedColumns = this.visibleColumns.map(column => column.name);
  }

  sortData(event: MatSort) {
    console.log( ' sort mmmmmmmmmmmmm', event)
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
    // if (this.columnResizeDnDService.isDropListDropped(event, visibleColumns, this.columns)) {
    //  this.setGridColumView();
    //  this.scrollToPosition(0);
    // }
  }

  checkResizeORDnD(event: any, index: number) {
    // this.columnResizeDnDService.checkResizeORDnD(event, index, this.matTableRef);
  }

  onResizeColumn(event: any, index: number) {
    // this.columnResizeDnDService
    //  .onResizeColumn(event, index, this.gridConfigs.enableColumnResize, this.renderer, this.matTableRef);
  }

  isDragDisabled(column: IccField): boolean {
    return false;
    // console.log( ' this.isColumnResizing=', this.columnResizeDnDService.isColumnResizing )
    // return !this.gridConfigs.enableColumnDnD || this.columnResizeDnDService.isColumnResizing || column.dragDisabled;
  }

  onDragStarted(event: CdkDragStart, index: number, visibleColumns) {
    // this.columnResizeDnDService.onDragStarted(event, index, visibleColumns, this.matTableRef);
  }

  onDragMoved(event, index, visibleColumns) {
    // this.columnResizeDnDService.onDragMoved(event, index, visibleColumns);
  }

}

