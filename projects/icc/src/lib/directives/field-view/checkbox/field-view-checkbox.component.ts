import { Component } from '@angular/core';
import { IccFieldViewComponent } from '../field-view.component';

@Component({
  selector: 'icc-field-view-checkbox',
  templateUrl: './field-view-checkbox.component.html',
  styleUrls: ['./field-view-checkbox.component.scss']
})
export class IccFieldViewCheckboxComponent<T> extends IccFieldViewComponent<T> {

  constructor() {
    super();
  }

  fieldChange(event, value: any) {
    this.field.checked = !this.field.checked;
    super.fieldChange(event, value);
  }
}

