import { IccNumberFilter, NumericFilterActions } from '../../filter/number_filter';
import { IccRansackFilter } from './filter';

export class IccRansackNumberFilter<T> extends IccRansackFilter<T> {
  private _filter: IccNumberFilter;

  set filter(val: IccNumberFilter) {
    this._filter = val;
  }

  get filter(): IccNumberFilter {
    return this._filter;
  }

  getParams(): T[] {
    const value = this.filter.value;
    if (this.filter.action) {
      const params = [];
      let key = this.filter.field + '_';
      switch (this.filter.action) {
        case NumericFilterActions.NOT_NULL:
          key += 'not_null';
          break;
        case NumericFilterActions.NULL:
          key += 'null';
          break;
        case NumericFilterActions.GTE:
          key += 'gteq';
          break;
        case NumericFilterActions.GT:
          key += 'gt';
          break;
        case NumericFilterActions.LTE:
          key += 'lteq';
          break;
        case NumericFilterActions.LT:
          key += 'lt';
          break;
        case NumericFilterActions.EQ:
          key += 'eq';
          break;
        case NumericFilterActions.INCLUDES:
          key += 'cont';
          break;
      }
      const p = {};
      p[key] = value;
      params.push(p);
      return params;
    }
  }
}
