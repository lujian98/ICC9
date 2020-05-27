import { IccDateFilter } from '../../filter/date_filter';
import { IccRansackFilter } from './filter';
import { IccDateRange } from '../../../components/date-picker/model/model';

export class IccRansackDateFilter<T> extends IccRansackFilter<T> {
  private _filter: IccDateFilter;

  set filter(val: IccDateFilter) {
    this._filter = val;
  }

  get filter(): IccDateFilter {
    return this._filter;
  }

  getParams(): T[] {
    const range = this.filter.range as IccDateRange;
    if (range && range.fromDate) {
      const begin = (range.fromDate instanceof Date) ? range.fromDate : new Date(range.fromDate);
      const end = (range.toDate instanceof Date) ? range.toDate : new Date(range.toDate);
      const params = [];
      const field = this.filter.field;
      let p1 = {};
      p1[field + '_gteq'] = this.encodeISODate(begin);
      params.push(p1);
      p1 = {};
      p1[field + '_lteq'] = this.encodeISODate(end);
      params.push(p1);
      return params;
    }
  }

  private encodeISODate(date: Date) {
    return encodeURIComponent(date.toISOString());
  }
}
