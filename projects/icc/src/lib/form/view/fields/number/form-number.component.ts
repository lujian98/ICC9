import { Component } from '@angular/core';
import { IccFormFieldComponent } from '../form-field.component';

@Component({
  selector: "app-form-number",
  templateUrl: './form-number.component.html',
  styleUrls: ['./form-number.component.scss']
})
export class IccFormNumberComponent extends IccFormFieldComponent {
  constructor() {
    super();
  }

  onWheelMove() {}
}

