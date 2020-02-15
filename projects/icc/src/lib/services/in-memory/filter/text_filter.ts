import { IccInMemeoryFilter } from './filter';
import { IccTextFilter } from '../../filter/text_filter';

export class IccInMemeoryTextFilter extends IccInMemeoryFilter {
  private _filter: IccTextFilter;

  set filter(val: IccTextFilter) {
    this._filter = val;
  }

  get filter(): IccTextFilter {
    return this._filter;
  }

  isInFilter(value: string): boolean {
    const search = this.filter.search;
    if (value.toLowerCase().indexOf(search.trim().toLowerCase()) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
