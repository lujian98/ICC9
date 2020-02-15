import { Component } from '@angular/core';
import { IccCellRendererComponent } from '../cell-renderer.component';

@Component({
  selector: 'icc-date-cell-renderer',
  templateUrl: './date-cell-renderer.component.html',
})
export class IccDateCellRendererComponent<T> extends IccCellRendererComponent<T> {

  constructor() {
    super();
  }
}
