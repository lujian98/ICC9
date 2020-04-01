import { Component } from '@angular/core';
import { IccDataSource } from '../../../datasource/datasource';
import { IccField } from '../../../items';

@Component({
  template: '',
})
export class IccCellRendererComponent<T> {
  rowHeight: number;
  column: IccField;
  dataKeyId: string;
  field: string;
  value: T;
  rowIndex: number;
  colIndex: number;
  record: T;
  dataSource: IccDataSource<T>;

  constructor() { }

  getDisplayValue(column: IccField, record: T): string {
    if (column.itemtype === 'select') {
      return column.getSelectedLabel(record[column.name]);
    } else if (column.itemtype === 'radio') {
      return column.getSelectedLabel(record[column.name]);
    } else {
      return record[column.name];
    }
  }

  getDisplayDetail(column: IccField, record: T): string {
    if (column.itemtype === 'select' || column.itemtype === 'radio') {
      return column.getSelectedDetail(record[column.name]);
    } else {
      return record[column.name];
    }
  }
}
