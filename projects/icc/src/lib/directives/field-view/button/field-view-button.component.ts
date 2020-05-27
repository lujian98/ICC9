import { Component } from '@angular/core';
import { IccFieldViewComponent } from '../field-view.component';

@Component({
  selector: 'icc-field-view-button',
  templateUrl: './field-view-button.component.html',
  styleUrls: ['./field-view-button.component.scss']
})
export class IccFieldViewButtonComponent<T> extends IccFieldViewComponent<T> {

  constructor() {
    super();
  }

  fieldChange(event, value: any) {
    console.log('this.field=', this.field )
    event.stopPropagation();
    super.fieldChange(event, value);
  }
}

