import { Component } from '@angular/core';
import { IccCellRendererComponent } from '../cell-renderer.component';

@Component({
  selector: 'icc-edit-cell-renderer',
  templateUrl: './edit-cell-renderer.component.html',
})
export class IccEditCellRendererComponent<T> extends IccCellRendererComponent<T> {

  constructor() {
    super();
  }
}
