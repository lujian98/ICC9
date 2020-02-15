import { IccTextFilter } from '../../filter/text_filter';
import { IccRansackFilter } from './filter';

export class IccRansackTextFilter<T> extends IccRansackFilter<T> {
  private _filter: IccTextFilter;

  set filter(val: IccTextFilter) {
    this._filter = val;
  }

  get filter(): IccTextFilter {
    return this._filter;
  }

  getParams(): T[] {
    const value = this.filter.search;
    if (value) {
      const params = [];
      const key = this.filter.field + '_cont';
      const p = {};
      p[key] = value;
      params.push(p);
      return params;
    }
  }
}
