import { Component } from '@angular/core';
import { IccCellRendererComponent } from '../cell-renderer.component';

@Component({
  selector: 'icc-cell-renderer-slider',
  templateUrl: './cell-renderer-slider.component.html',
})
export class IccCellRendererSliderComponent<T> extends IccCellRendererComponent<T> {

  constructor() {
    super();
  }
}
