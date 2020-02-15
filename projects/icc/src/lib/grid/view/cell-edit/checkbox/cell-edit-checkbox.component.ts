import { Component } from '@angular/core';
import { IccCellEditComponent } from '../cell-edit.component';
import { IccCheckboxField } from '../../../../items';

@Component({
  selector: 'icc-cell-edit-checkbox',
  templateUrl: './cell-edit-checkbox.component.html',
})
export class IccCellEditCheckboxComponent<T> extends IccCellEditComponent<T> {
  column: IccCheckboxField;

  constructor() {
    super();
  }


  checkboxClicked(column: IccCheckboxField) {
    // this.filteredValues[column.field] = !this.filteredValues[column.field];
    // this.setDataFilters();
  }
}
