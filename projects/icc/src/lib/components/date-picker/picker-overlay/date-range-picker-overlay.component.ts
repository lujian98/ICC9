import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IccDatePresetItem } from '../model/model';
import { IccDateRangeStoreService } from '../services/date-range-store.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { IccDateConfigStoreService } from '../services/date-config-store.service';
import { IccPickerOverlayAnimations } from './picker-overlay.animations';

@Component({
  selector: 'icc-date-range-picker-overlay',
  templateUrl: './date-range-picker-overlay.component.html',
  styleUrls: ['./date-range-picker-overlay.component.scss'],
  animations: [IccPickerOverlayAnimations.transformPanel],
  encapsulation: ViewEncapsulation.None
})
export class IccDateRangePickerOverlayComponent implements AfterViewInit, OnInit {
  fromDate: Date;
  toDate: Date;
  fromMinDate: Date;
  fromMaxDate: Date;
  toMinDate: Date;
  toMaxDate: Date;
  presets: Array<IccDatePresetItem> = [];
  startDatePrefix: string;
  endDatePrefix: string;
  applyLabel: string;
  cancelLabel: string;
  shouldAnimate: string;
  selectedRangeDates: Array<Date> = [];

  constructor(
    private rangeStoreService: IccDateRangeStoreService,
    private configStoreService: IccDateConfigStoreService,
    private overlayRef: OverlayRef
  ) { }

  ngOnInit() {
    this.fromDate = this.rangeStoreService.fromDate;
    this.startDatePrefix = this.configStoreService.dateRangeOptions.startDatePrefix || 'FROM:';
    this.endDatePrefix = this.configStoreService.dateRangeOptions.endDatePrefix || 'TO:';
    this.applyLabel = this.configStoreService.dateRangeOptions.applyLabel || 'Apply';
    this.cancelLabel = this.configStoreService.dateRangeOptions.cancelLabel || 'Cancel';
    this.presets = this.configStoreService.dateRangeOptions.presets;
    this.shouldAnimate = this.configStoreService.dateRangeOptions.animation
      ? 'enter'
      : 'noop';
    ({
      fromDate: this.fromMinDate,
      toDate: this.fromMaxDate
    } = this.configStoreService.dateRangeOptions.fromMinMax);
    ({
      fromDate: this.toMinDate,
      toDate: this.toMaxDate
    } = this.configStoreService.dateRangeOptions.toMinMax);
  }

  ngAfterViewInit() {
    if (this.fromDate) {
      this.fromMonthViewChange(this.fromDate);
    }
    setTimeout(() => {
      if (this.rangeStoreService.toDate) {
        this.toDate = this.rangeStoreService.toDate;
        if (!this.isRangeInCurrentMonth()) {
          this.toMonthViewChange(this.toDate);
        }
        this.setSelectedRangeDates();
      }
    }, 50);
  }

  private isRangeInCurrentMonth(): boolean {
    const date = this.toDate;
    const pDate = this.fromDate;
    if (date.getFullYear() === pDate.getFullYear() && date.getMonth() === pDate.getMonth()) {
      const tDate = new Date();
      if (date.getFullYear() === tDate.getFullYear() && date.getMonth() === tDate.getMonth()) {
        return true;
      }
    }
  }

  updateFromDate(date: Date) {
    this.checkSelectDateRange(date, 'from');
  }

  updateToDate(date: Date) {
    this.checkSelectDateRange(date, 'to');
  }

  private checkSelectDateRange(date: Date, type: string) {
    if (this.fromDate && this.toDate) {
      if (type === 'from') {
        this.fromDate = date;
        this.toDate = null;
      } else if (type === 'to') {
        this.fromDate = null;
        this.toDate = date;
      }
    } else {
      if (!this.fromDate) {
        this.fromDate = date;
      } else {
        this.toDate = date;
      }
    }
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      const tdate = this.fromDate;
      this.fromDate = this.toDate;
      this.toDate = tdate;
    }
    this.setSelectedRangeDates();
  }

  private setSelectedRangeDates() {
    this.selectedRangeDates = [];
    if (this.fromDate && this.toDate) {
      let mdate = new Date(this.fromDate.getTime());
      mdate = new Date(mdate.setDate(mdate.getDate() - 1));
      while (mdate < this.toDate) {
        this.selectedRangeDates.push(mdate);
        mdate = new Date(mdate.setDate(mdate.getDate() + 1));
      }
    }
  }

  fromMonthViewChange(date: Date) {
    this.toMinDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }

  toMonthViewChange(date: Date) {
    this.fromMaxDate = new Date(date.getFullYear(), date.getMonth(), 0);
  }

  updateRangeByPreset(presetItem: IccDatePresetItem) {
    this.fromDate = null;
    this.toDate = null;
    this.updateFromDate(presetItem.range.fromDate);
    setTimeout(() => {
      this.updateToDate(presetItem.range.toDate);
    }, 50);
  }

  applyNewDates(e) {
    this.rangeStoreService.updateRange(this.fromDate, this.toDate);
    this.disposeOverLay();
  }

  discardNewDates(e) {
    this.disposeOverLay();
  }

  private disposeOverLay() {
    this.overlayRef.dispose();
  }
}
