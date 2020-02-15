import { Injectable } from '@angular/core';
import { IccDateRangeOptions } from '../model/model';

@Injectable()
export class IccDateConfigStoreService {
  private _dateRangeOptions: IccDateRangeOptions;
  private defaultOptions = {
    excludeWeekends: false,
    animation: true,
    locale: 'en-US',
    minMax: { fromDate: null, toDate: null },
    fromMinMax: { fromDate: null, toDate: null },
    toMinMax: { fromDate: null, toDate: null },
    displaySelected: true,
    selectApply: false
  };

  constructor() { }

  get dateRangeOptions(): IccDateRangeOptions {
    return this._dateRangeOptions;
  }

  set dateRangeOptions(options: IccDateRangeOptions) {
    this._dateRangeOptions = { ...this.defaultOptions, ...options };
  }
}
