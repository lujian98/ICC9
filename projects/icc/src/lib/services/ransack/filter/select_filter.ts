import { IccSelectFilter } from '../../filter/select_filter';
import { IccRansackFilter } from './filter';

// Really multi-select
export class IccRansackSelectFilter<T> extends IccRansackFilter<T> {
  private _filter: IccSelectFilter<T>;

  set filter(val: IccSelectFilter<T>) {
    this._filter = val;
  }

  get filter(): IccSelectFilter<T> {
    return this._filter;
  }

  getParams(): T[] {
    const choices = this.filter.choices;
    if (choices.length > 0) {
      const params = [];
      const key = this.filter.field + (this.filter.multiSelect ? '_in[]' : '_in');
      choices.forEach(value => {
        const p = {};
        p[key] = value;
        params.push(p);
      });
      return params;
    }
  }
}
