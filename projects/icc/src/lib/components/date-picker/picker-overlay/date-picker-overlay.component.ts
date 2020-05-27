import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IccDatePresetItem } from '../model/model';
import { IccDateRangeStoreService } from '../services/date-range-store.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { IccDateConfigStoreService } from '../services/date-config-store.service';
import { IccPickerOverlayAnimations } from './picker-overlay.animations';

@Component({
  selector: 'icc-date-picker-overlay',
  templateUrl: './date-picker-overlay.component.html',
  styleUrls: ['./date-picker-overlay.component.scss'],
  animations: [IccPickerOverlayAnimations.transformPanel],
  encapsulation: ViewEncapsulation.None
})
export class IccDatePickerOverlayComponent implements OnInit {
  selectedDate: Date;
  minDate: Date;
  maxDate: Date;
  presets: Array<IccDatePresetItem> = [];
  datePrefix: string;
  applyLabel: string;
  cancelLabel: string;
  shouldAnimate: string;

  displaySelected: boolean;
  selectApply: boolean;

  constructor(
    private rangeStoreService: IccDateRangeStoreService,
    private configStoreService: IccDateConfigStoreService,
    private overlayRef: OverlayRef
  ) { }

  ngOnInit() {
    if (this.selectedDate) {
      setTimeout(() => {
        this.updateSelectedDate(this.selectedDate);
      }, 10);
    } else {
      this.selectedDate = this.rangeStoreService.selectedDate;
    }

    this.datePrefix = this.configStoreService.dateRangeOptions.datePrefix || 'Selected Date:';
    this.applyLabel = this.configStoreService.dateRangeOptions.applyLabel || 'Apply';
    this.cancelLabel = this.configStoreService.dateRangeOptions.cancelLabel || 'Cancel';
    this.displaySelected = this.configStoreService.dateRangeOptions.displaySelected;
    this.selectApply = this.configStoreService.dateRangeOptions.selectApply;

    this.presets = this.configStoreService.dateRangeOptions.presets;
    this.shouldAnimate = this.configStoreService.dateRangeOptions.animation
      ? 'enter'
      : 'noop';
    ({
      fromDate: this.minDate,
      toDate: this.maxDate
    } = this.configStoreService.dateRangeOptions.minMax);
  }

  updateSelectedDate(date: Date) {
    this.selectedDate = date;
    if (this.selectApply) {
      this.rangeStoreService.updateSelected(this.selectedDate);
    }
    // this.disposeOverLay();
  }

  updateSelectDateByPreset(presetItem: IccDatePresetItem) {
    this.updateSelectedDate(presetItem.selectedDate);
  }

  applyNewDates(e) {
    this.rangeStoreService.updateSelected(this.selectedDate);
    this.disposeOverLay();
  }

  discardNewDates(e) {
    this.disposeOverLay();
  }

  private disposeOverLay() {
    this.overlayRef.dispose();
  }
}
