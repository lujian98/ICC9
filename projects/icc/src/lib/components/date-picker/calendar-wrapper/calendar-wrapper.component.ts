import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { IccDateConfigStoreService } from '../services/date-config-store.service';

@Component({
  selector: 'icc-calendar-wrapper',
  templateUrl: './calendar-wrapper.component.html',
  styleUrls: ['./calendar-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IccCalendarWrapperComponent implements AfterViewInit, OnChanges, OnDestroy {
  dateFormat: string;
  currentMonth: Date;
  @Input() selectedDate: Date;
  @Input() prefixLabel: string;
  @Input() displaySelected: boolean;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() selectedRangeDates: Array<Date> = [];

  @ViewChild(MatCalendar) matCalendar: MatCalendar<Date>;
  @Output() readonly selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() readonly monthViewChange: EventEmitter<Date> = new EventEmitter<Date>();

  private sub: Subscription;

  weekendFilter = (d: Date) => true;
  constructor(private configStore: IccDateConfigStoreService) {
    this.dateFormat = configStore.dateRangeOptions.format;
    if (configStore.dateRangeOptions.excludeWeekends) {
      this.weekendFilter = (d: Date): boolean => {
        const day = d.getDay();
        return day !== 0 && day !== 6;
      };
    }
    this.currentMonth = this.getFirstDay(new Date());
  }

  ngAfterViewInit() {
    if (this.matCalendar) {
      this.sub = this.matCalendar.stateChanges.subscribe(() => {
        this.onMonthSelected(this.matCalendar.activeDate);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Material calendar bug - sometime not able refresh view when set maxDate/minDate
    if (changes.selectedDate && changes.selectedDate.currentValue && this.matCalendar) {
      this.matCalendar.activeDate = changes.selectedDate.currentValue; // TODO error here
    }
    if (!this.maxDate) {
      this.maxDate = new Date('2222-06-24T18:30:00.000Z');
      setTimeout(() => {
        this.maxDate = null;
      }, 10);
    }
    if (!this.minDate) {
      this.minDate = new Date('1900-01-01T18:30:00.000Z');
      setTimeout(() => {
        this.minDate = null;
      }, 10);
    }
  }

  onSelectedChange(date) {
    this.selectedDateChange.emit(date);
  }

  onMonthSelected(date: Date) {
    if (date) {
      const newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      if (!this.isSameMonth(newMonth, this.currentMonth)) {
        this.currentMonth = newMonth;
        this.monthViewChange.emit(newMonth);
      }
    }
  }

  isSameMonth(date: Date, pDate: Date): boolean {
    return date.getFullYear() === pDate.getFullYear() && date.getMonth() === pDate.getMonth();
  }

  getFirstDay(date: Date) {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
  }

  onYearSelected(e) { }

  onUserSelection(e) { }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      if (this.selectedRangeDates.length > 0) {
        const find = this.selectedRangeDates.findIndex(d => d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
        );
        if (find === 0 || find === this.selectedRangeDates.length - 1) {
          return 'icc-date-range-selected-date';
        } else if (find > 0) {
          return 'icc-date-range-dates';
        }
      }
      return '';
    };
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
