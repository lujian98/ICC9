import { Component } from '@angular/core';
import { IccFieldViewComponent } from '../field-view.component';

@Component({
  selector: 'icc-field-view-checkbox',
  templateUrl: './field-view-checkbox.component.html',
})
export class IccFieldViewCheckboxComponent<T> extends IccFieldViewComponent<T> {

  constructor() {
    super();
  }
}

