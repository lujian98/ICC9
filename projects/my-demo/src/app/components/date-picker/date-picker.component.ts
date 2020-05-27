import { Component, OnInit, ViewChild } from '@angular/core';
import { IccDateRange, IccDateRangeOptions, IccDateSelectionOptions, IccDatePresetItem } from 'icc';

@Component({
  selector: 'doc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DocDatePickerComponent implements OnInit {
  range: IccDateRange = { fromDate: new Date(), toDate: new Date() };
  options: IccDateRangeOptions;
  dateoptions: IccDateSelectionOptions;

  presets: Array<IccDatePresetItem> = [];
  presets2: Array<IccDatePresetItem> = [];

  @ViewChild('pickerOne') pickerOne;

  constructor() {}

  ngOnInit() {
    const today = new Date();
    const fromMax = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const toMin = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      range: { fromDate: today, toDate: today },
      fromMinMax: { fromDate: null, toDate: fromMax },
      toMinMax: { fromDate: toMin, toDate: null }
    };

    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const minDate = new Date(today.getFullYear(), today.getMonth() - 4, 1);
    const selectedDate = new Date(today.getTime() - 6 * (24 * 60 * 60 * 1000));
    this.dateoptions = {
      presets: this.presets2,
      format: 'mediumDate',
      selectedDate: selectedDate,
      minMax: { fromDate: minDate, toDate: maxDate }
    };
  }

  updateRange(range: IccDateRange) {
    this.range = range;
  }

  updateDate(date: Date) {
    console.log(date);
  }

  setupPresets() {
    const backDate = numOfDays => {
      const day = new Date();
      return new Date(day.setDate(day.getDate() - numOfDays));
    };

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7);
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets = [
      {
        presetLabel: 'Yesterday',
        range: { fromDate: yesterday, toDate: today }
      },
      {
        presetLabel: 'Last 7 Days',
        range: { fromDate: minus7, toDate: today }
      },
      {
        presetLabel: 'Last 30 Days',
        range: { fromDate: minus30, toDate: today }
      },
      {
        presetLabel: 'This Month',
        range: { fromDate: currMonthStart, toDate: currMonthEnd }
      },
      {
        presetLabel: 'Last Month',
        range: { fromDate: lastMonthStart, toDate: lastMonthEnd }
      }
    ];

    this.presets2 = [
      { presetLabel: 'Today', selectedDate: today },
      { presetLabel: 'Yesterday', selectedDate: yesterday },
      { presetLabel: '7 Days Ago', selectedDate: minus7 },
      { presetLabel: 'This Week', selectedDate: this.get1stDayOfWeek(today) },
      { presetLabel: 'Last Week', selectedDate: this.get1stDayOfWeek(minus7) },
      { presetLabel: 'This Month', selectedDate: currMonthStart },
      { presetLabel: 'Last Month', selectedDate: lastMonthStart }
    ];
  }

  get1stDayOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 0);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  }
}
