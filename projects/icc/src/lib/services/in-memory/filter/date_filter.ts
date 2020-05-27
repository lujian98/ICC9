import { IccInMemeoryFilter } from './filter';
import { IccDateFilter } from '../../filter/date_filter';
import { IccDateRange } from '../../../components/date-picker/model/model';

export class IccInMemeoryDateFilter<T> extends IccInMemeoryFilter {
  private _filter: IccDateFilter;

  set filter(val: IccDateFilter) {
    this._filter = val;
  }

  get filter(): IccDateFilter {
    return this._filter;
  }

  isInFilter(value: string): boolean {
    const range = this.filter.range as IccDateRange;
    if (range) {
      if (value && value !== '') {
        const begin = (range.fromDate instanceof Date) ? range.fromDate : new Date(range.fromDate);
        const end = (range.toDate instanceof Date) ? range.toDate : new Date(range.toDate);
        const vDate = new Date(value);
        if (vDate >= begin && vDate <= end) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}


