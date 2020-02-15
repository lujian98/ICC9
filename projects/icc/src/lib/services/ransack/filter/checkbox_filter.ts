import { IccRansackFilter } from './filter';
import { IccCheckboxFilter } from '../../filter/checkbox_filter';

export class IccRansackCheckboxFilter<T> extends IccRansackFilter<T> {
  private _filter: IccCheckboxFilter;

  set filter(val: IccCheckboxFilter) {
    this._filter = val;
  }

  get filter(): IccCheckboxFilter {
    return this._filter;
  }

  getParams(): T[] {
    const checked = this.filter.checked;
    if (checked) {
      const params = [];
      const key = this.filter.field + '_not_null';
      const p = {};
      p[key] = checked;
      params.push(p);
      return params;
    }
  }
}
