import { Component } from '@angular/core';
import { IccFormFieldComponent } from '../form-field.component';

@Component({
  selector: 'icc-form-radio',
  templateUrl: './form-radio.component.html',
  styleUrls: ['./form-radio.component.scss']
})
export class IccFormRadioComponent extends IccFormFieldComponent {

  constructor() {
    super();
  }
}

