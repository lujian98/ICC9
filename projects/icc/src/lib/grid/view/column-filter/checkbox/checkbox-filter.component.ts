import { Component } from '@angular/core';
import { IccColumnFilterComponent } from '../column-filter.component';
import { IccCheckboxField } from '../../../../items';

@Component({
  selector: 'icc-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
})
export class IccCheckboxFilterComponent<T> extends IccColumnFilterComponent<T> {
  column: IccCheckboxField;

  constructor() {
    super();
  }

  checkboxClicked() {
    this.filteredValues[this.column.name] = !this.filteredValues[this.column.name];
    this.setDataFilters();
  }
}
