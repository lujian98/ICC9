import { IccFilter } from '../../filter/filter';
import { IccFilters } from '../../filter/filters';
import { IccRansackFilter } from './filter';
import { IccRansackCheckboxFilter } from './checkbox_filter';
import { IccRansackNumberFilter } from './number_filter';
import { IccRansackSelectFilter } from './select_filter';
import { IccRansackTextFilter } from './text_filter';
import { IccRansackDateFilter } from './date_filter';

export class IccRansackFilterFactory<T> {
  componentMapper: {};

  constructor() {
    this.componentMapper = {
      checkbox: IccRansackCheckboxFilter,
      number: IccRansackNumberFilter,
      select: IccRansackSelectFilter,
      text: IccRansackTextFilter,
      date: IccRansackDateFilter,
    };
  }

  getFilter(filter: IccFilter) {
    const filterType = filter.type;
    const component = this.componentMapper[filterType];
    const componentRef = new component();
    componentRef.filter = filter;
    return componentRef;
  }

  getRansackFilters(filters: IccFilters): IccRansackFilter<T>[] {
    const ransackFilters: Array<IccRansackFilter<T>> = [];
    for (const filter of filters.filters) {
      ransackFilters.push(this.getFilter(filter));
    }
    return ransackFilters;
  }
}
