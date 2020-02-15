import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IccField } from '../../../items';

@Component({
  template: '',
})
export class IccFormFieldComponent implements OnInit, OnDestroy {
  field: IccField;
  group: FormGroup;

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

