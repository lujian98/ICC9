import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IccField } from '../../../items';
import { IccBaseGridDataSource } from '../../datasource/grid-datasource';


@Component({
  selector: 'icc-grid-column-filter',
  template: '',
})
export class IccColumnFilterComponent<T> implements OnInit, OnDestroy {
  filterType: string;
  rowHeight = 48;
  column: IccField;
  dataSource: IccBaseGridDataSource<T>;
  protected _value: T;
  private _filteredValues: {};

  isFilterChanged$: Subject<{}> = new Subject();

  set filteredValues(val: {}) {
    this._filteredValues = val;
    if ( this.filteredValues[this.column.name]) {
      this.value = this.filteredValues[this.column.name];
    } else {
      this.value = null;
    }
  }

  get filteredValues(): {} {
    return this._filteredValues;
  }

  set value(val: T ) {
    this._value = val;
  }

  get value(): T {
    return this._value;
  }

  constructor() { }

  ngOnInit(): void { }

  applyFilter(event, filterValue: T) {
    event.stopPropagation();
    this.value = filterValue;
    this.filteredValues[this.column.name] = filterValue;
    this.setDataFilters();
  }

  clearFilter(event) {
    event.stopPropagation();
    this.value = null;
    this.filteredValues[this.column.name] = '';
    this.setDataFilters();
  }

  setDataFilters() {
    this.isFilterChanged$.next(this.filteredValues);
  }

  ngOnDestroy() {
    this.isFilterChanged$.complete();
  }
}
