import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IccField } from '../../items';
import { IccDataSource } from '../../datasource/datasource';

@Component({
  template: '',
})
export class IccFieldViewComponent<T> implements OnInit, OnDestroy {
  field: IccField;
  protected _value: T;

  group: FormGroup;

  dataSource: IccDataSource<T>;

  // protected _value: T;
  private _filteredValues: {};

  isFieldValueChanged$: Subject<{}> = new Subject();

  set value(val: T ) {
    this._value = val;
  }

  get value(): T {
    return this._value;
  }

  constructor() { }
  ngOnInit() {
    this.value = null;
  }

  fieldChange(event, value: any) {
    this.setFieldValueChanged(value);
  }

  clearField(event) {
    event.stopPropagation();
    this.value = null;
  }

  setFieldValueChanged(val: any) {
    this.value = val;
    const change = {
      field: this.field,
      value: val
    };
    this.isFieldValueChanged$.next(change);
  }

  resetValue(event) {
    event.stopPropagation();
    this.field.value = this.field.orgValue;
    this.setFieldValueChanged(this.field.value);
  }

  ngOnDestroy() {
    this.isFieldValueChanged$.complete();
  }
}

