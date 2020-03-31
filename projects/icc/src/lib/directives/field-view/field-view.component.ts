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

  group: FormGroup;

  dataSource: IccDataSource<T>;

  // protected _value: T;
  private _filteredValues: {};

  isFieldValueChanged$: Subject<{}> = new Subject();

  constructor() { }
  ngOnInit() { }

  fieldChange(event, value: any) {
    this.setFieldValueChanged(value);
  }

  setFieldValueChanged(val: any) {
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

