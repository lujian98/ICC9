import { IccFilter } from '../../filter/filter';
import { IccInMemeoryFilter } from './filter';
import { IccFilters } from '../../filter/filters';
import { IccInMemeoryCheckboxFilter } from './checkbox_filter';
import { IccInMemeoryNumberFilter } from './number_filter';
import { IccInMemeorySelectFilter } from './select_filter';
import { IccInMemeoryTextFilter } from './text_filter';


export class IccInMemeoryFilterFactory {
  componentMapper: {};

  constructor() {
    this.componentMapper = {
      checkbox: IccInMemeoryCheckboxFilter,
      number: IccInMemeoryNumberFilter,
      select: IccInMemeorySelectFilter,
      text: IccInMemeoryTextFilter,
    };
  }

  getFilter(filter: IccFilter) {
    const filterType = filter.type;
    let component = this.componentMapper[filterType];
    if (!component) {
      component = this.componentMapper['text'];
    }
    const componentRef = new component();
    componentRef.filter = filter;
    return componentRef;
  }

  getFilters(filters: IccFilters): IccInMemeoryFilter[] {
    const memoryFilters: Array<IccInMemeoryFilter> = [];
    for (const filter of filters.filters) {
      memoryFilters.push(this.getFilter(filter));
    }
    return memoryFilters;
  }

  filterData<T>(data: T[], filters: IccFilters): T[] {
    const memoryFilters = this.getFilters(filters);
    const filterdData = data.filter(item => {
      let status = false;
      let filtered = false;
      for (let i = 0; i < filters.filters.length; i++) {
        const filter = filters.filters[i];
        if (filter.enabled) {
          const key = filter.field;
          const memoryFilter = memoryFilters[i];
          status = memoryFilter.isInFilter(item[key]);
          filtered = true;
          if (!status) { break; }
        }
      }
      if (filtered) {
        return status;
      } else {
        return true;
      }
    });
    return filterdData;
  }
}
