import { Injectable, Inject, InjectionToken, OnDestroy } from '@angular/core';
import { IccDateRange } from '../model/model';
import { Subject } from 'rxjs';

export const DATE = new InjectionToken<Date>('date');

@Injectable()
export class IccDateRangeStoreService implements OnDestroy {
  rangeUpdate$: Subject<IccDateRange> = new Subject<IccDateRange>();
  updateSelected$: Subject<Date> = new Subject<Date>();

  constructor(
    @Inject(DATE) private _selectedDate: Date,
    @Inject(DATE) private _fromDate: Date,
    @Inject(DATE) private _toDate: Date
  ) { }

  get selectedDate(): Date {
    return this._selectedDate;
  }

  get fromDate(): Date {
    return this._fromDate;
  }

  get toDate(): Date {
    return this._toDate;
  }

  updateRange(fromDate: Date = this._fromDate, toDate: Date = this._toDate) {
    this._fromDate = fromDate;
    this._toDate = toDate;
    this.rangeUpdate$.next({ fromDate: this._fromDate, toDate: this._toDate });
  }

  updateSelected(selectedDate: Date = this._selectedDate) {
    this._selectedDate = selectedDate;
    this.updateSelected$.next(this._selectedDate);
  }

  ngOnDestroy() {
    this.rangeUpdate$.complete();
    this.updateSelected$.complete();
  }
}
