import { Component } from '@angular/core';
import { IccFormFieldComponent } from '../form-field.component';
import { IccTextField } from '../../../../items';

@Component({
  selector: "app-form-text",
  templateUrl: './form-text.component.html',
  styleUrls: ['./form-text.component.scss']
})
export class IccFormTextComponent extends IccFormFieldComponent {
  field: IccTextField;

  constructor() {
    super();
  }
}
