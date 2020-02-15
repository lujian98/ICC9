import { Injectable, Component } from '@angular/core';

import { IccCheckboxFilterComponent } from './checkbox/checkbox-filter.component';
import { IccDateFilterComponent } from './date/date-filter.component';
import { IccNumberFilterComponent } from './number/number-filter.component';
import { IccSelectFilterComponent } from './select/select-filter.component';
import { IccTextFilterComponent } from './text/text-filter.component';
import { IccColumnConfig } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class IccColumnFilterService {
  componentMapper = {
    checkbox: IccCheckboxFilterComponent,
    date: IccDateFilterComponent,
    number: IccNumberFilterComponent,
    select: IccSelectFilterComponent,
    text: IccTextFilterComponent,
  };

  getColumnFilters() {
    return this.componentMapper;
  }

  getColumnFilterByIndex(index, columnConfigs: IccColumnConfig[]): Component {
    const columnConfig = columnConfigs[index];
    let itemtype = 'text';
    const filterField = columnConfig.filterField;
    if (filterField) {
      if (typeof filterField === 'string') {
        itemtype = this.getMappedFilterType(filterField, columnConfigs);
      } else {
        const type = columnConfig.type;
        itemtype = typeof type === 'string' ? type : type.type;
      }
    }
    return this.componentMapper[itemtype];
  }

  private getMappedFilterType(filterField: string, columnConfigs: IccColumnConfig[]): string {
    let itemtype = 'text';
    columnConfigs.forEach(columnConfig => {
      if (columnConfig.name === filterField) {
        const type = columnConfig.type;
        itemtype = typeof type === 'string' ? type : type.type;
      }
    });
    return itemtype;
  }
}
