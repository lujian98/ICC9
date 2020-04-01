import { Observable, of } from 'rxjs';
import { IccSelectType } from '../../models';
// import { IccGridState, IccCellEditData } from '../../grid';
import { IccAbstractDataService } from '../abstract-data.service';
import { IccAbstractStateService } from '../abstract-state.service';
import { IccLoadRecordParams } from '../loadRecordParams.model';
import { IccInMemeoryFilterFactory } from './filter/filter_factory';
import { IccInMemoryDataSort } from './in-memory-data.sort';


// export class IccInMemoryDataService<T> extends IccAbstractDataService<T> implements IccAbstractStateService {

export class IccInMemoryDataService<T> extends IccAbstractDataService<T> {

  constructor(
  ) {
    super();
    this.requestDebounceTime = 250;
  }

  callRequestService(loadParams: IccLoadRecordParams): Observable<T[]> {
    return of(this.getProcessedData(this.queuedData, loadParams));
  }

  resetDataSourceService(loadParams: IccLoadRecordParams) {
    if (this.dataSourceUrl) {
      this.queuedData = [];
    }
    loadParams.pagination.offset = 0;
    loadParams.pagination.page = 1;
  }

  getProcessedData(data: T[], loadParams: IccLoadRecordParams): T[] {
    if (loadParams.filters) {
      const filters = new IccInMemeoryFilterFactory();
      data = filters.filterData(data, loadParams.filters) as T[];
    }
    this.totalRecords = data.length;

    if (loadParams.sorts) {
      const sorts = new IccInMemoryDataSort();
      data = sorts.sortData(data, loadParams.sorts) as T[];
    }
    if (this.dataSourceUrl || this.queuedData.length === 0) {
      this.queuedData = [...data];
    }
    if (loadParams.pagination && loadParams.pagination.offset > -1) {
      const end = loadParams.pagination.offset + loadParams.pagination.limit;
      data = data.slice(0, end);
    }
    this.totalRowGroups = 0;
    if (loadParams.rowGroups.isRowGrouped) {
      loadParams.rowGroups.setRowGroups(this.queuedData);
      this.totalRowGroups = loadParams.rowGroups.rowGroups.length;
      data = loadParams.rowGroups.getRowGroupData(data);
    }
    return data;
  }

  selectionOptionRequest(keyValue: string, fieldType: IccSelectType) { }

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
  } */

  getDetailData(dataKeyId: string, dataKeyValue: string | number) { }

  onUpdateData(dataKeyId: string, dataKeyValue: string | number, values): Observable<T> {
    return of();
  }

  deleteSelected(dataKeyId: string, selectedId: number | string): Observable<T> {
    return of();
  }
}

