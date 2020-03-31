import { Component } from '@angular/core';
import { IccFieldViewComponent } from '../field-view.component';
// import { IccTextField } from '../../../../items';

@Component({
  selector: 'icc-field-view-text.component',
  templateUrl: './field-view-text.component.html',
  styleUrls: ['./field-view-text.component.scss']
})
export class IccFieldViewTextComponent<T> extends IccFieldViewComponent<T> {
  // column: IccTextField;

  constructor() {
    super();
  }
}
