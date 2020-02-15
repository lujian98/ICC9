import { Component, Injectable } from '@angular/core';
import { IccColumnConfig } from '../../../models';
import { IccCellEditCheckboxComponent } from './checkbox/cell-edit-checkbox.component';
import { IccCellEditNumberComponent } from './number/cell-edit-number.component';
import { IccCellEditRadioComponent } from './radio/cell-edit-radio.component';
import { IccCellEditSelectComponent } from './select/cell-edit-select.component';
import { IccCellEditTextComponent } from './text/cell-edit-text.component';

export interface IccCellEditData <T>{
  dataKeyId: string;
  dataKeyValue: string;
  field: string;
  value: T;
}

@Injectable({
  providedIn: 'root'
})
export class IccCellEditService {
  componentMapper = {
    checkbox: IccCellEditCheckboxComponent,
    number: IccCellEditNumberComponent,
    radio: IccCellEditRadioComponent,
    select: IccCellEditSelectComponent,
    text: IccCellEditTextComponent,
  };

  getColumnFilters() {
    return this.componentMapper;
  }

  getEditFieldByIndex(index: number, columnConfigs: IccColumnConfig[]): Component {
    const columnConfig = columnConfigs[index];
    const editField = columnConfig.editField;
    if (editField) {
      let itemtype = 'text';
      if (typeof editField === 'string') {
        itemtype = this.getEditFieldType(editField, columnConfigs);
      } else {
        const type = columnConfig.type;
        itemtype = (typeof type === 'string') ? type : type.type;
      }
      return this.componentMapper[itemtype];
    }
  }

  private getEditFieldType(editField: string, columnConfigs: IccColumnConfig[]): string {
    let itemtype = 'text';
    columnConfigs.forEach(columnConfig => {
      if (columnConfig.name === editField) {
        const type = columnConfig.type;
        itemtype = (typeof type === 'string') ? type : type.type;
      }
    });
    return itemtype;
  }
}
