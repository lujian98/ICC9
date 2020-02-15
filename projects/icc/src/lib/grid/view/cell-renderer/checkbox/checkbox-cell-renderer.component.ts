import { Component } from '@angular/core';
import { IccCellRendererComponent } from '../cell-renderer.component';

@Component({
  selector: 'icc-checkbox-cell-renderer',
  templateUrl: './checkbox-cell-renderer.component.html',
})
export class IccCheckboxCellRendererComponent<T> extends IccCellRendererComponent<T> {

  constructor() {
    super();
  }
}
