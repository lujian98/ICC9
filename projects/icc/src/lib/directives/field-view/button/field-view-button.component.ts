import { Component } from '@angular/core';
import { IccFieldViewComponent } from '../field-view.component';

@Component({
  selector: 'icc-field-view-button',
  templateUrl: './field-view-button.component.html',
})
export class IccFieldViewButtonComponent extends IccFieldViewComponent {

  constructor() {
    super();
  }

  fieldChange(event, value: any) {
    event.stopPropagation();
    super.fieldChange(event, value);
  }
}

