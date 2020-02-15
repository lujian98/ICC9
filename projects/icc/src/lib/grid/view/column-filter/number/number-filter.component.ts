import { Component } from '@angular/core';
import { IccColumnFilterComponent } from '../column-filter.component';
import { IccNumberField } from '../../../../items';

@Component({
  selector: 'icc-number-filter',
  templateUrl: './number-filter.component.html',
  styleUrls: ['./number-filter.component.scss']
})
export class IccNumberFilterComponent<T> extends IccColumnFilterComponent<T> {
  column: IccNumberField;

  constructor() {
    super();
  }
}
