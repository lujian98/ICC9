import { IccFilter } from './filter';
import { IccField } from '../../items';
import { IccFilterFactory } from './filter_factory';
import { IccDateFilter } from './date_filter';

export class IccFilters {
  private _filters: Array<IccFilter> = [];

  get filters(): Array<IccFilter> {
    return this._filters;
  }

  constructor() {}

  setFilters(columns: IccField[]) {
    const factory = new IccFilterFactory();
    columns.forEach((column: IccField, index) => {
      const filter = factory.getFilter(column, columns);
      this._filters.push(filter);
    });
  }

  update(filteredValues: {}) {
    this.filters.forEach(filter => {
      const key = filter.key;
      if (filter.type === 'date') {
        const f = filter as IccDateFilter;
        f.range = filteredValues[key];
      } else {
        if (filteredValues[key]) {
          let value = filteredValues[key];
          if (value instanceof Array) {
            value = value.join();
          }
          filter.search = value;
        } else {
          filter.search = '';
        }
      }
    });
  }
}
