import { Component } from '@angular/core';
import { IccColumnFilterComponent } from '../column-filter.component';
import { IccDateField } from '../../../../items';

@Component({
  selector: 'icc-date-filter',
  templateUrl: './date-filter.component.html',
})
export class IccDateFilterComponent<T> extends IccColumnFilterComponent<T> {
  column: IccDateField;

  constructor() {
    super();
  }
  changeValue(event, value, picker) {
    console.log(picker);
    console.log(picker.beginDate);
    console.log(picker.endDate);

  }
}
