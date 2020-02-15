import { Component } from '@angular/core';
import { IccCellRendererComponent } from '../cell-renderer.component';
import { IccField } from '../../../../items';
import { IccColumnConfig } from '../../../../models';

@Component({
  selector: 'icc-inner-html-cell-renderer',
  templateUrl: './inner-html-cell-renderer.component.html',
})
export class IccInnerHTMLRendererComponent<T> extends IccCellRendererComponent<T> {

  constructor() {
    super();
  }

  getInnerHtml(column: IccField, field: string, value: T, record: T, rowIndex: number): string {
    let html = '';
    const itemConfig = column.itemConfig as IccColumnConfig;
    if (typeof itemConfig.renderer === 'function') {
      html += itemConfig.renderer(value, field, column, record, rowIndex, this.dataSource);
    }
    return html;
  }
}