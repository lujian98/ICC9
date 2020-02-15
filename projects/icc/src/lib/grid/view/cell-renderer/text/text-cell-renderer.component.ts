import { Component } from '@angular/core';
import { IccCellRendererComponent } from '../cell-renderer.component';
import { IccField } from '../../../../items';

@Component({
  selector: 'icc-text-cell-renderer',
  templateUrl: './text-cell-renderer.component.html',
})
export class IccTextCellRendererComponent<T> extends IccCellRendererComponent<T> {

  constructor() {
    super();
  }

  cellMenuClick($event, column: IccField, rowIndex: number, record) {
    /*
    this.iccCellMenuClickEvent.emit({
      column: column,
      record: record,
    }); */
  }
}
