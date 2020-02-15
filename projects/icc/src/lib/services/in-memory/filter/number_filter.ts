import { IccInMemeoryFilter } from './filter';
import { IccNumberFilter, NumericFilterActions } from '../../filter/number_filter';

export class IccInMemeoryNumberFilter extends IccInMemeoryFilter {
  private _filter: IccNumberFilter;

  set filter(val: IccNumberFilter) {
    this._filter = val;
  }

  get filter(): IccNumberFilter {
    return this._filter;
  }

  isInFilter(value: number): boolean {
    const filter = this.filter.value;
    if (this.filter.action) {
      switch (this.filter.action) {
        case NumericFilterActions.NOT_NULL:
          return value !== null;
        case NumericFilterActions.NULL:
          return value === null;
        case NumericFilterActions.GTE:
          return value !== null && value >= filter;
        case NumericFilterActions.GT:
          return value !== null && value > filter;
        case NumericFilterActions.LTE:
          return value !== null && value <= filter;
        case NumericFilterActions.LT:
          return value !== null && value < filter;
        case NumericFilterActions.EQ:
          return value !== null && value === filter;
        case NumericFilterActions.INCLUDES:
          return value !== null && value.toString().includes(filter.toString());
      }
    } else {
      return true;
    }
  }
}

