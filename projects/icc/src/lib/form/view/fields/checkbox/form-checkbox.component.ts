import { Component } from '@angular/core';
import { IccFormFieldComponent } from '../form-field.component';

@Component({
  selector: "app-form-checkbox",
  templateUrl: './form-checkbox.component.html',
})
export class IccFormCheckboxComponent extends IccFormFieldComponent {

  constructor() {
    super();
  }
}

