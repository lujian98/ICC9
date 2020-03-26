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
}

