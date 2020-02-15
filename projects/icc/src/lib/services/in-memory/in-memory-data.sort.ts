import { IccSorts } from '../sort/sorts';
import { IccUtils } from '../../utils/utils';

export class IccInMemoryDataSort {

  sortData<T>(data: T[], sorts: IccSorts): T[] {
    const sortlist = sorts.sorts;
    if (sortlist && sortlist.length > 0) {
      sortlist.forEach(aSort => {
        data = IccUtils.dataSortByField(data, aSort.sortField, aSort.direction);
      });
    }
    return data;
  }
}
