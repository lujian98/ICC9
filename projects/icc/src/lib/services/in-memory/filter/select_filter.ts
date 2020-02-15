import { IccInMemeoryFilter } from './filter';
import { IccSelectFilter } from '../../filter/select_filter';

// Really multi-select
export class IccInMemeorySelectFilter<T> extends IccInMemeoryFilter {
  private _filter: IccSelectFilter<T>;

  set filter(val: IccSelectFilter<T>) {
    this._filter = val;
  }

  get filter(): IccSelectFilter<T> {
    return this._filter;
  }

  isInFilter(value: string | number): boolean {
    const choices = this.filter.choices;
    if (choices.length === 0) {
      return true;
    }
    for (const choice of this.filter.choices) {
      if (value === choice) {
        return true;
      }
    }
    return false;
  }
}


