import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
// import { IccCellEditData } from '../../grid';
import { IccSelectOption, IccSelectType } from '../../models';
import { IccAbstractDataService } from '../abstract-data.service';
import { IccFilters } from '../filter/filters';
import { IccLoadRecordParams } from '../loadRecordParams.model';
import { IccPagination } from '../pagination/pagination';
import { IccRowGroups } from '../row-group/row-groups';
import { IccSorts } from '../sort/sorts';
import { IccRansackFilterFactory } from './filter/filter_factory';


// @Injectable()
export class IccRansackDataService<T> extends IccAbstractDataService<T> {

  private _userInfo: any;

  get userInfo(): any {
    return this._userInfo;
  }

  set userInfo(val: any) {
    this._userInfo = val;
  }

  constructor(protected httpClient: HttpClient) {
    super();
    this.requestDebounceTime = 200;
  }

  callRequestService(loadParams: IccLoadRecordParams): Observable<T[]> {
    if (loadParams.rowGroups.isCollapsing || loadParams.rowGroups.isExpanding) {
      const data = this.getProcessedData([], loadParams);
      return of(data);
    } else {
      const params = this.getRequestParams(loadParams);
      return this.httpClient.get<T[]>(this.dataSourceUrl, { params })
        .pipe(
          map(response => {
            if (this.totalRecordsName && response[this.totalRecordsName]) {
              this.totalRecords = response[this.totalRecordsName];
            }
            // const rowGroups = response['rowGroups'] ? response['rowGroups'] : [];
            const data = this.dataSourceKey ? response[this.dataSourceKey] : response;
            return this.getProcessedData(data, loadParams);
          }),
        );
    }
  }

  resetDataSourceService(loadParams: IccLoadRecordParams) {
    this.queuedData = [];
    // this.groupedData = [];
    loadParams.pagination.offset = 0;
    loadParams.pagination.page = 1;
  }

  getProcessedData(data: T[], loadParams: IccLoadRecordParams): T[] {
    if (loadParams.rowGroups.isCollapsing || loadParams.rowGroups.isExpanding) {
      data = [...this.queuedData];
    } else if (this.queuedData.length > 0 && loadParams.pagination.offset > 0) {
      data = this.queuedData.concat(data);
    }
    this.queuedData = [...data];
    this.totalRowGroups = 0;
    if (loadParams.rowGroups.isRowGrouped) {
      if (!loadParams.rowGroups.isCollapsing && !loadParams.rowGroups.isExpanding) {
        loadParams.rowGroups.setRowGroups(data);
      }
      this.totalRowGroups = loadParams.rowGroups.rowGroups.length;
      data = loadParams.rowGroups.getRowGroupData(data);
    }
    return data;
  }



  /*

    getProcessedData(data: T[], loadParams: IccLoadRecordParams): T[] {
    if (loadParams.rowGroups.isCollapsing || loadParams.rowGroups.isExpanding) {
      data = [...this.queuedData];
    } else if (this.queuedData.length > 0 && loadParams.pagination.offset > 0) {
      data = this.queuedData.concat(data);
    }
    this.queuedData = [...data];

    if (loadParams.rowGroups.isRowGrouped) {
      if (!loadParams.rowGroups.isCollapsing && !loadParams.rowGroups.isExpanding) {
        loadParams.rowGroups.setRowGroups(data);
      }
      data = loadParams.rowGroups.getRowGroupData(data);
    }
    return data;
  }

  getProcessedData(data: T[], loadParams: IccLoadRecordParams, rowGroups: T[]): T[] {
    if (this.queuedData.length > 0 && (loadParams.pagination.offset > 0)) {
      data = this.queuedData.concat(data); // only page can have concat and rowgroup expand too
    }
    this.queuedData = data;
    if (loadParams.rowGroups && loadParams.rowGroups.isRowGrouped) {
      // if (loadParams.rowGroups.isGrouping) {
        loadParams.rowGroups.getRowGroupData(rowGroups, []);
      }
      if (loadParams.rowGroups.isCollapsing) {
        this.queuedData = loadParams.rowGroups.removeCollapsed(this.queuedData);
      }
      this.groupedData = loadParams.rowGroups.getRowGroupData(data, this.groupedData);
      data = loadParams.rowGroups.getGroupExpandFilteredData(this.groupedData);
    }
    return data;
  } */

  getRequestParams(loadParams: IccLoadRecordParams): HttpParams {
    let httpParams = new HttpParams();
    httpParams = this.paramDeviceType(httpParams);
    for (const key in loadParams) {
      if (loadParams.hasOwnProperty(key)) {
        const obj = loadParams[key];
        if (key === 'filters') {
          httpParams = this.appendFilterHttpParams(obj, httpParams);
        } else if (key === 'sorts') {
          httpParams = this.appendSortHttpParams(obj, httpParams);
        // } else if (key === 'rowGroups') {
        //  httpParams = this.appendRowGroupHttpParams(obj, httpParams);
        } else if (key === 'pagination') {
          httpParams = this.appendPaginationHttpParams(obj, httpParams);
        }
      }
    }
    return httpParams;
  }

  appendFilterHttpParams(filters: IccFilters, params: HttpParams): HttpParams {
    const factory = new IccRansackFilterFactory();
    const ransackFilters = factory.getRansackFilters(filters);
    ransackFilters.forEach((filter) => {
      const filterParams = filter.getParams();
      if (filterParams && filterParams.length > 0) {
        filterParams.forEach(pairs => {
          Object.keys(pairs).forEach(key => {
            let value = pairs[key];
            value = (value || value === 0) ? value.toString() : '';
            params = params.append(key, value);
          });
        });
      }
    });
    return params;
  }

  // Single column sort with order=position.asc
  // Multi-Sort column sort with order[]=position.asc&order[]=another_position.desc
  appendSortHttpParams(sorts: IccSorts, params: HttpParams): HttpParams {
    const sortlist = sorts.sorts;
    if (sortlist && sortlist.length > 0) {
      // sortlist.slice().reverse().forEach(aSort => {
      sortlist.reverse().forEach(aSort => {
        const val = aSort.sortField + '.' + aSort.convertDirection();
        if (sorts.multiSort) {
          params = params.append('order[]', val.toString());
        } else {
          params = params.append('order', val.toString());
        }
      });
      sortlist.reverse(); // need reverse back to keep the order
    }
    return params;
  }

  /*
  appendRowGroupHttpParams(rowGroups: IccRowGroups, params: HttpParams): HttpParams {
    const groups = rowGroups.groupByColumns;
    if (groups && groups.length > 0) {
      groups.forEach(group => {
        if (rowGroups.multiGroup) {
          params = params.append('groupBy[]', group.toString());
        } else {
          params = params.append('groupBy', group.toString());
        }
      });
      if (rowGroups.isExpanding) {
        const row = rowGroups.expandedGroup;
        if (row && row.expanded) {
          const field = row.field;
          const value = row[field];
          params = params.append('expandedGroup[]', field.toString() + '.eq.' + value.toString());
        }
      }
      const expandedGroups = rowGroups.expandedGroups;
      if (expandedGroups && expandedGroups.length > 0) {
        expandedGroups.forEach(group => {
          const field = group.field;
          const value = group[field];
          params = params.append('expandedGroup[]', field.toString() + '.eq.' + value.toString());
        });
      }
    }
    return params;
  } */

  appendPaginationHttpParams(pagination: IccPagination, params: HttpParams): HttpParams {
    const offset = (pagination.offset > 0) ? pagination.offset : 0;
    const limit = pagination.limit;
    params = params.append('offset', offset.toString());
    params = params.append('limit', limit.toString());
    return params;
  }

  selectionOptionRequest(keyValue: string, fieldType: IccSelectType): Subscription {
    let params = new HttpParams();
    params = this.paramDeviceType(params);
    const keyName = fieldType.dataSourceKey ? fieldType.dataSourceKey : 'field';
    const url = fieldType.dataSourceUrl ? fieldType.dataSourceUrl : this.dataSourceUrl;
    const path = fieldType.dataSourcePath ? fieldType.dataSourcePath : 'selectionOptions';
    params = params.append(keyName, keyValue.toString());
    const urlpath = url + '/' + path;
    return this.httpClient.get<IccSelectOption[]>(urlpath, { params })
      .pipe(
        map((data: IccSelectOption[]) => {
          const rdata = {};
          rdata[keyValue] = data;
          return rdata;
        })
      )
      .subscribe((data: T) => this.selectionOptionsChanged$.next(data));
  }

  /*
  onSaveGridStates(gridTableID: string, states: IccGridState): void { }

  getGridStates(gridTableID: string): Observable<IccGridState> {
    const states: IccGridState = {
      columns: [],
      sorts: [],
      filters: [],
    };
    return of(states);
  }

  onSaveGridCellValue(cellData: IccCellEditData<T>): Observable<T> {
    return of();
  }

  onSaveGridCellValue(cellData: IccCellEditData<T>): Observable<T> {
    const url = this.dataSourceUrl + '/updateRecord';
    let params = new HttpParams();
    params = this.paramDeviceType(params);
    params = params.append('key', cellData.dataKeyId.toString());
    params = params.append('keyValue', cellData.dataKeyValue.toString());
    params = params.append('field', cellData.field.toString());
    params = params.append('value', cellData.value.toString());
    return this.httpClient.post(url, params)
      .pipe(
        map((data: any) => {
          data['success'] = true;
          return data;
        })
      );
  } */

  getDetailData(dataKeyId: string, dataKeyValue: string | number) {
    let params = new HttpParams();
    params = this.paramDeviceType(params);
    params = params.append(dataKeyId, dataKeyValue.toString());
    const url = this.dataSourceUrl + '/detail';
    this.httpClient.get<T>(url, { params })
      .pipe(
        map(response => {
          return response;
        }),
      )
      .subscribe(data => this.setDetailDataSource(data));
  }

  private encodeISODate(date: Date) {
    return date.toISOString();
    // return encodeURIComponent(date.toISOString());
  }

  onUpdateData(dataKeyId: string, dataKeyValue: string | number, values): Observable<T> {
    const url = this.dataSourceUrl + '/update';
    let params = new HttpParams();
    params = this.paramDeviceType(params);
    params = params.append(dataKeyId, dataKeyValue.toString());

    Object.keys(values).forEach((key) => {
      let value = values[key];
      if (key !== dataKeyId && value !== null) {
        if (value instanceof Date) {
          value = this.encodeISODate(value);
        }
        params = params.append(key.toString(), value);
      }
    });
    params = this.additionParams(values, params);
    console.log(params);
    return this.httpClient.post(url, params)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  additionParams(values: any, params: HttpParams): HttpParams {
    return params;
  }

  deleteSelected(dataKeyId: string, selectedId: number | string): Observable<T> {
    const url = this.dataSourceUrl + '/delete';
    let params = new HttpParams();
    params = this.paramDeviceType(params);
    params = params.append(dataKeyId, selectedId.toString());
    console.log(params);
    return this.httpClient.post(url, params)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
}
