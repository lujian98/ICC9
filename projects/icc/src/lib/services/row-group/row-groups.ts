import { IccRowGroup } from './row-group';
import { IccField } from '../../items';

export interface IccGroupByColumn {
  column: string;
  field: string;
}

export class IccRowGroups {
  private isGrouping: boolean;
  private expandedCount = 0;
  private collapsedCount = 0;

  private _groupByColumns: IccGroupByColumn[] = [];
  private _rowGroups: IccRowGroup[] = [];
  private _isCollapsing: boolean;
  private _isExpanding: boolean;
  private _enableMultiRowGroup: boolean;

  set rowGroups(groups: IccRowGroup[]) {
    this._rowGroups = groups;
  }

  get rowGroups(): IccRowGroup[] {
    return this._rowGroups;
  }

  set groupByColumns(val: IccGroupByColumn[]) {
    this._groupByColumns = val;
  }

  get groupByColumns(): IccGroupByColumn[] {
    return this._groupByColumns;
  }

  set enableMultiRowGroup(val: boolean) {
    this._enableMultiRowGroup = val;
  }

  get enableMultiRowGroup(): boolean {
    return this._enableMultiRowGroup;
  }

  get isRowGrouped(): boolean {
    return this.groupByColumns.length ? true : false;
  }

  get hasRowGroupCollapsed(): boolean {
    return this.rowGroups.filter(group => !group.expanded).length > 0;
  }

  set isCollapsing(val: boolean) {
    this._isCollapsing = val;
  }

  get isCollapsing(): boolean {
    return this._isCollapsing;
  }

  set isExpanding(val: boolean) {
    this._isExpanding = val;
  }

  get isExpanding(): boolean {
    return this._isExpanding;
  }

  setRowGrouping(column: IccField, addgroup: boolean) {
    this.setGroupByColumns(column, addgroup);
    this.isCollapsing = false;
    this.isExpanding = false;
  }

  private setGroupByColumns(column: IccField, addgroup: boolean) {
    if (!this.enableMultiRowGroup) {
      this.groupByColumns = [];
    }
    if (addgroup) {
      this.groupByColumns.push({
        column: column.name,
        field: column.groupField !== true ? (column.groupField as string) : column.name
      });
    } else {
      this.groupByColumns = this.groupByColumns.filter(group => group.column !== column.name);
    }
    console.log(' this.groupByColumns =', this.groupByColumns);
  }

  setRowGroupExpand(rowGroup: IccRowGroup) {
    this.isCollapsing = rowGroup.expanded ? false : true;
    this.isExpanding = rowGroup.expanded ? true : false;
    if (this.rowGroups.length > 0) {
      for (const group of this.rowGroups) {
        if (group.isSameGroup(rowGroup)) {
          group.expanded = rowGroup.expanded;
        }
      }
    }
  }

  getRowGroupScrollPosition(end: number): number {
    this.expandedCount = 0;
    this.collapsedCount = 0;
    const rootGroup = new IccRowGroup();
    rootGroup.expanded = true;
    this.setSubGroupCounts(end, 0, this.groupByColumns, rootGroup);
    // end = this.collapsedCount + this.expandedCount;
    // console.log(' 2222 expandedCount=', this.expandedCount, ' collapsedCount=', this.collapsedCount, ' end =', end )
    return this.collapsedCount + this.expandedCount;
  }

  private setSubGroupCounts(end: number, level: number, groupByColumns: IccGroupByColumn[], parent: IccRowGroup) {
    if (level >= groupByColumns.length) {
      return;
    }
    const currentColumn = groupByColumns[level].field;
    const rowGroups = this.rowGroups.filter(group => group.level === level + 1 && (level === 0 ||
      (group.field === currentColumn && group[parent.field] === parent[parent.field])));

    rowGroups.forEach(group => {
      if (this.expandedCount <= end) { // TODO condition
        if (group.expanded) {
          if (level + 1 === groupByColumns.length) {
            this.expandedCount += group.totalCounts;
          }
          this.setSubGroupCounts(end, level + 1, groupByColumns, group);
        } else {
          this.collapsedCount += group.totalCounts;
        }
      }
    });
  }

  private resetRowCollapsed(prevRowGroups: IccRowGroup[]) {
    if (this.rowGroups.length > 0) {
      for (const group of this.rowGroups) {
        const findGroup = prevRowGroups.filter((pgroup: IccRowGroup) => group.isSameGroup(pgroup));
        if (findGroup.length === 1) {
          group.expanded = findGroup[0].expanded;
        }
      }
    }
  }

  setRowGroups<T>(data: T[]) {
    this.isGrouping = true;
    const prevRowGroups: IccRowGroup[] = [...this.rowGroups];
    this.rowGroups = [];
    const rootGroup = new IccRowGroup();
    rootGroup.expanded = true;
    this.getSublevel(data, 0, this.groupByColumns, rootGroup);
    this.resetRowCollapsed(prevRowGroups);
    this.isGrouping = false;
  }

  getRowGroupData<T>(data: T[]): T[] {
    this.isExpanding = false;
    this.isCollapsing = false;
    const groupedData = this.getGroupData(data);
    return this.getGroupExpandFilteredData(groupedData);
  }

  getGroupData<T>(data: T[]): T[] {
    const rootGroup = new IccRowGroup();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, this.groupByColumns, rootGroup) as T[];
  }

  private getSublevel<T>(data: T[], level: number, groupByColumns: IccGroupByColumn[], parent: IccRowGroup): T[] {
    if (level >= groupByColumns.length) {
      return data as [];
    }
    if (this.isGrouping) {
      this.initialRowGroups(data, level, groupByColumns, parent);
    }
    let subGroups = [];
    const rowGroups = this.rowGroups.filter(group => group.parent.isSameGroup(parent));
    // const currentColumn = groupByColumns[level];
    const currentColumn = groupByColumns[level].field;
    rowGroups.forEach(group => {
      group.isDisplayed = false;
      if (group.level === level + 1) {
        const rowsInGroup = this.uniqueBy(
          data.filter(row => group.expanded && !(row instanceof IccRowGroup) && group[currentColumn] === row[currentColumn]),
          JSON.stringify
        );
        const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
        if (this.isGrouping && group.totalCounts === 0) {
          group.totalCounts = rowsInGroup.length;
        } else {
          if (rowsInGroup.length > 0) {
            group.isDisplayed = true;
            group.displayedCounts = rowsInGroup.length;
          }
          subGroups = subGroups.concat(group);
        }
        subGroups = subGroups.concat(subGroup);
      }
    });
    return subGroups;
  }

  private initialRowGroups<T>(data: T[], level: number, groupByColumns: IccGroupByColumn[], parent: IccRowGroup) {
    const groups = this.uniqueBy(
      data.map(row => {
        const group = new IccRowGroup();
        group.level = level + 1;
        group.parent = parent;
        for (let i = 0; i <= level; i++) {
          // group.field = groupByColumns[i];
          // group[groupByColumns[i]] = row[groupByColumns[i]];
          group.field = groupByColumns[i].field;
          group[groupByColumns[i].field] = row[groupByColumns[i].field];
          if (groupByColumns[i].column !== groupByColumns[i].field) {
            group.value = row[groupByColumns[i].column];
          }

        }
        return group;
      }),
      JSON.stringify
    );
    this.rowGroups = this.rowGroups.concat(groups);
  }

  uniqueBy<T>(a: T[], key: any) {
    const seen = {};
    return a.filter(item => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  private getGroupExpandFilteredData<T>(groupedData: any[]): T[] {
    const data = groupedData.filter(gdata => {
      return this.filterGroupExpandedData(gdata, groupedData, this.groupByColumns);
    });
    return data;
  }

  private filterGroupExpandedData<T>(gdata: T[] | IccRowGroup, groupedData: IccRowGroup[], groupByColumns: IccGroupByColumn[]): boolean {
    return gdata instanceof IccRowGroup ? gdata.visible : this.getDataRowVisible(gdata, groupedData, groupByColumns);
  }

  private getDataRowVisible<T>(gdata: T[], groupedData: IccRowGroup[], groupByColumns: IccGroupByColumn[]): boolean {
    const groupRows = groupedData.filter(row => {
      if (row instanceof IccRowGroup) {
        let match = true;
        groupByColumns.forEach(group => {
          const field = group.field;
          if (!row[field] || !gdata[field] || row[field] !== gdata[field]) {
            match = false;
          }
        });
        return match;
      }
    });
    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as IccRowGroup;
    return parent.visible && parent.expanded;
  }
}

