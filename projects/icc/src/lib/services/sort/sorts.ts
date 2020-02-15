import { IccField } from '../../items';
import { IccSortState } from '../../grid';
import { IccSort } from './sort';
import { IccUtils } from '../../utils/utils';
import { IccGroupByColumn } from '../row-group/row-groups';

export class IccSorts {
  private _sorts: IccSort[];
  private _multiSort: boolean;
  private _isSorting: boolean;

  set sorts(val: IccSort[]) {
    this._sorts = val;
  }

  get sorts(): IccSort[] {
    return this._sorts;
  }

  set multiSort(val: boolean) {
    this._multiSort = val;
  }

  get multiSort(): boolean {
    return this._multiSort;
  }

  set isSorting(val: boolean) {
    this._isSorting = val;
  }

  get isSorting(): boolean {
    return this._isSorting;
  }

  constructor() { }

  getSortByKey(key: string): IccSort {
    if (this.sorts) {
      for (const aSort of this.sorts) {
        if (aSort.key === key) {
          return aSort;
        }
      }
    }
  }

  getSortDirectionByKey(key: string) {
    const sort = this.getSortByKey(key);
    if (sort) {
      return sort.direction;
    }
  }

  update(column: IccField, key: string, direction: string, active: boolean) {
    this.remove(key, true);
    if (active) {
      this.add(column, key, direction, active);
    } else if (this.sorts && this.sorts.length > 0) {
      this.sorts[this.sorts.length - 1].active = true;
    }
  }

  private add(column: IccField, key: string, direction: string, active: boolean) {
    const sort = new IccSort(column, key, direction, active);
    if (!this.sorts) {
      this.sorts = [sort];
    } else {
      this.sorts.push(sort);
    }
  }

  private remove(key: string, setInactive: boolean) {
    if (this.sorts && this.sorts.length > 0) {
      let found = null;
      for (const aSort of this.sorts) {
        if (aSort.key === key) {
          found = this.sorts.indexOf(aSort, 0);
        } else if (setInactive) {
          aSort.active = false;
        }
      }
      if (found != null && found >= 0) {
        this.sorts.splice(found, 1);
      }
    }
  }

  removeOtherSortKey(groups: IccGroupByColumn[]) {
    if (groups.length > 0) {
      groups.forEach(group => {
        if (group.column !== group.field) {
          const fieldSort = this.getSortByKey(group.field);
          if (fieldSort) {
            this.remove(group.field, false);
          }
        }
      });
    }
  }

  setRowGroupSort(groups: IccGroupByColumn[], columns: IccField[]) {
    if (!this.sorts) {
      this.sorts = [];
    }
    if (groups.length > 0) {
      [...groups].reverse().forEach(group => {
        const column: IccField = IccUtils.findExactByKey(columns, 'name', group.column);
        if (column) {
          const existSort = this.getSortByKey(group.column);
          const direction = existSort ? existSort.direction : 'asc';
          const active = existSort ? existSort.active : false;
          if (existSort) {
            this.remove(group.column, false);
          }
          if (group.column !== group.field) {
            const fieldSort = this.getSortByKey(group.field);
            if (fieldSort) {
              this.remove(group.field, false);
            }
            const fieldColumn = IccUtils.findExactByKey(columns, 'name', group.field);
            const newSort = new IccSort(fieldColumn, group.field, direction, active);
            this.sorts.push(newSort);
          }
          const sort = new IccSort(column, group.column, direction, active);
          this.sorts.push(sort);
        }
      });
    }
    if (!this.multiSort) {
      // const sorts = this.sorts.filter(sort => groups.indexOf(sort.key) >= 0 || sort.active);
      // this.sorts = [...sorts];
      const sorts = this.sorts.filter(sort => {
        const groupFields = groups.map(group => group.column);
        return groupFields.indexOf(sort.key) >= 0 || sort.active;
      });
      this.sorts = [...sorts];
    }
    console.log(' this.sorts=', this.sorts);
  }

  getSortStates(): IccSortState[] {
    if (this.sorts && this.sorts.length > 0) {
      const sorts = this.sorts.map(aSort => {
        return {
          key: aSort.key,
          direction: aSort.direction
        };
      });
      return sorts;
    } else {
      return [];
    }
  }

  /*
  applySortStates(sorts: IccSortState[], gridColumns: IccColumns) {
    if (sorts && sorts.length > 0) {
      sorts.forEach((sort, index) => {
        const key = sort.key;
        const column = gridColumns.getColumnByKey(key);
        if (column) {
          this.remove(key, true);
          const active = (index === sorts.length - 1) ? true : false;
          this.add(column, key, sort.direction, active);
        }
      });
    }
  } */

  removeSorts() {
    if (this.sorts && this.sorts.length > 0) {
      this.sorts.forEach((sort) => {
        const key = sort.key;
        this.remove(key, true);
      });
    }
  }
}

