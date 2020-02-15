import { IccInMemeoryFilter } from './filter';
import { IccCheckboxFilter } from '../../filter/checkbox_filter';

export class IccInMemeoryCheckboxFilter extends IccInMemeoryFilter {
  private _filter: IccCheckboxFilter;

  set filter(val: IccCheckboxFilter) {
    this._filter = val;
  }

  get filter(): IccCheckboxFilter {
    return this._filter;
  }

  isInFilter(value: boolean): boolean {
    const checked = this.filter.checked;
    // only can filter checked value, when filter is unchecked, all values will be listed
    if (checked && value === checked) {
      return true;
    } else {
      return false;
    }
  }
}
