import { IccField } from '../../items';
import { IccTextFilter } from './text_filter';
import { IccNumberFilter } from './number_filter';
import { IccSelectFilter } from './select_filter';
import { IccDateFilter } from './date_filter';

export class IccFilterFactory {
  componentMapper: {};

  constructor() {
    this.componentMapper = {
      date: IccDateFilter,
      text: IccTextFilter,
      number: IccNumberFilter,
      select: IccSelectFilter
    };
  }

  getFilter(column: IccField, columns: IccField[]) {
    let itemtype = 'text';
    let filterField = column.name;
    if (column.filterField) {
      if (typeof column.filterField === 'string') {
        filterField = column.filterField;
        itemtype = this.getFilterType(filterField, columns);
      } else {
        const type = column.type;
        itemtype = typeof type === 'string' ? type : type.type;
      }
    }
    let component = this.componentMapper[itemtype];
    if (!component) {
      component = this.componentMapper['text'];
    }
    const componentRef = new component(column, filterField);
    return componentRef;
  }

  private getFilterType(filterField: string, columns: IccField[]): string {
    let itemtype = 'text';
    columns.forEach(column => {
      if (column.name === filterField) {
        const type = column.type;
        itemtype = typeof type === 'string' ? type : type.type;
      }
    });
    return itemtype;
  }
}
