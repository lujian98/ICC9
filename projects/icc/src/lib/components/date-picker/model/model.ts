export interface IccDatePresetItem {
  presetLabel: string;
  range?: IccDateRange;
  selectedDate?: Date;
}

export interface IccDateRange {
  fromDate: Date;
  toDate: Date;
}

export interface IccCalendarOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  shouldCloseOnBackdropClick?: boolean;
}

export interface IccDateSelectionOptions {
  presets?: Array<IccDatePresetItem>;
  format: string;
  excludeWeekends?: boolean;
  locale?: string;
  selectedDate?: Date;
  minMax?: IccDateRange;
  applyLabel?: string;
  cancelLabel?: string;
  animation?: boolean;
  calendarOverlayConfig?: IccCalendarOverlayConfig;
  placeholder?: string;
  datePrefix?: string;
  displaySelected?: boolean;
  selectApply?: boolean;
}

export interface IccDateRangeOptions extends IccDateSelectionOptions {
  range?: IccDateRange;
  fromMinMax?: IccDateRange;
  toMinMax?: IccDateRange;
  startDatePrefix?: string;
  endDatePrefix?: string;
}
