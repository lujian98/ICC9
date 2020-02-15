import { Component } from '@angular/core';
import { IccFormFieldComponent } from '../form-field.component';
import { IccSelectField } from '../../../../items';

@Component({
  selector: 'icc-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss']
})
export class IccFormSelectComponent<T> extends IccFormFieldComponent {
  field: IccSelectField<T>;

  constructor() {
    super();
  }

  fieldChange(event, value: any) {
    if (this.field.multiSelect && value.length > 0 && !value[0]) {
      value = [];
    }
    super.fieldChange(event, value);
  }

  resetValue(event) {
    event.stopPropagation();

    this.field.value = this.field.orgValue;
    this.setFieldValueChanged(this.field.value);
  }

  displayValue(): string { // for readonly field will not in the form control
    if (this.field && this.field.readonly) {
      const label = this.field.getSelectedLabel(this.field.value);
      if (label) {
        this.field.value = label;
      }
      return this.field.value;
    }
  }
}


/*
      const col = column as IccSelectColumn<T>;
      if (col.filterMultiSelect) {
        value = value.map((val: string) => {
          return col.getSelectedLabel(val);
        });
      } else {
        value = col.getSelectedLabel(value);
      }
      */