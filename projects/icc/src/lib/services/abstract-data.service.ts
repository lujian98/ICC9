import { HttpParams } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, skip, switchMap } from 'rxjs/operators';
// import { IccCellEditData } from '../grid';
import { IccSelectType } from '../models';
import { IccLoadRecordParams } from './loadRecordParams.model';

// @Injectable()
export abstract class IccAbstractDataService<T> implements OnDestroy {
  dataSourceUrl: string;
  dataSourceKey: string;
  totalRecordsName: string;

  private _requestDebounceTime = 300;
  private _totalRecords = 0;
  private _totalRowGroups = 0;
  private _queuedData: T[] = [];
  isLoading: boolean;

  dataSourceChanged$ = new Subject<T[]>();
  requestParamsChanged$: BehaviorSubject<IccLoadRecordParams> = new BehaviorSubject({});
  selectionOptionsChanged$ = new Subject<T>();
  detailDataSourceChanged$ = new Subject<T>();

  set totalRecords(val: number) {
    this._totalRecords = val;
  }

  get totalRecords(): number {
    return this._totalRecords;
  }

  set totalRowGroups(val: number) {
    this._totalRowGroups = val;
  }

  get totalRowGroups(): number {
    return this._totalRowGroups;
  }

  set requestDebounceTime(val: number) {
    this._requestDebounceTime = val;
  }

  get requestDebounceTime(): number {
    return this._requestDebounceTime;
  }

  set queuedData(val: T[]) {
    this._queuedData = val;
  }

  get queuedData(): T[] {
    return this._queuedData;
  }

  /*
  set groupedData(val: T[]) {
    this._groupedData = val;
  }

  get groupedData(): T[] {
    return this._groupedData;
  } */

  abstract callRequestService(loadParams: IccLoadRecordParams): Observable<T[]>;
  abstract resetDataSourceService(loadParams: IccLoadRecordParams);
  abstract selectionOptionRequest(keyValue: string, fieldType: IccSelectType);
  // abstract getGridStates(gridTableID: string): Observable<IccGridState>;
  // abstract onSaveGridStates(gridTableID: string, states: IccGridState): void;
  // abstract onSaveGridCellValue(cellData: IccCellEditData<T>): Observable<T>;
  abstract getDetailData(dataKeyId: string, dataKeyValue: string | number);
  abstract onUpdateData(dataKeyId: string, dataKeyValue: string | number, values: any): Observable<T>;
  abstract deleteSelected(dataKeyId: string, selectedId: number | string): Observable<T>;

  constructor() {
    this.initRequestParamsChanged();
  }

  initRequestParamsChanged() {
    this.requestParamsChanged$
      .pipe(
        skip(1),
        debounceTime(this.requestDebounceTime),
        distinctUntilChanged(),
        filter((loadParams: IccLoadRecordParams) => {
          return !(this.isLoading && loadParams.isRefresh);
        }),
        switchMap((loadParams: IccLoadRecordParams) => {
          this.isLoading = true;
          return this.callRequestService(loadParams);
          /*.pipe(
            takeUntil(
              this.requestParamsChanged$.pipe(skip(1))
            )
          ); */
        })
      )
      .subscribe((data: T[]) => {
        this.isLoading = false;
        this.setDataSource(data);
      });
  }

  setDataSource(data: T[]) {
    this.dataSourceChanged$.next(data);
  }

  setDetailDataSource(data: T) {
    this.detailDataSourceChanged$.next(data);
  }

  paramDeviceType(params: HttpParams): HttpParams {
    params = params.append('devicetype', this.dataSourceKey.toString());
    return params;
  }

  ngOnDestroy() {
    this.dataSourceChanged$.complete();
    this.requestParamsChanged$.complete();
    this.selectionOptionsChanged$.complete();
    this.detailDataSourceChanged$.complete();
  }
}
