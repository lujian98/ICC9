import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

/*
import {
  IccCalendarOverlayService,
  IccDateRangeStoreService,
  IccDatePresetItem,
  IccDateConfigStoreService,
  IccLocaleService,
} from '../../../../date-picker'; */

import { IccLocaleDatePipe } from '../../../../pipes/locale-date.pipe';
import { IccFormFieldComponent } from '../form-field.component';
import { IccDateField } from '../../../../items';


@Component({
  selector: 'app-form-date',
  templateUrl: './form-date.component.html',
  styleUrls: ['./form-date.component.scss'],
  /*
  providers: [
    IccCalendarOverlayService,
    IccDateRangeStoreService,
    IccDateConfigStoreService,
    IccLocaleDatePipe
  ], */
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IccFormDateComponent<T> extends IccFormFieldComponent implements OnInit, OnDestroy {
  field: IccDateField;
  selectedDate = '';
  private dateUpdate$: Subscription;

  @ViewChild('calendarInput') calendarInput;
  @Output() readonly selectedDateChanged: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    /*
    private calendarOverlayService: IccCalendarOverlayService<T>,
    public rangeStoreService: IccDateRangeStoreService,
    public configStoreService: IccDateConfigStoreService,
    private localeService: IccLocaleService, */
  ) {
    super();
  }

  ngOnInit() {
    /*
    this.dateUpdate$ = this.rangeStoreService.updateSelected$.subscribe(selectedDate => {
      if (selectedDate) {
        const selected: string = this.getFormatedDate(selectedDate);
        this.selectedDate = `${selected}`;
      } else {
        this.selectedDate = '';
      }
      this.field.value = this.selectedDate;
      this.calendarInput.nativeElement.focus();
      this.setFieldValueChanged(selectedDate);
      this.selectedDateChanged.emit(selectedDate);
    });

    setTimeout(() => {
      const backDate = numOfDays => {
        const day = new Date();
        return new Date(day.setDate(day.getDate() - numOfDays));
      };
      const today = new Date();
      const yesterday = backDate(1);
      const minus7 = backDate(7);
      const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const preset: Array<IccDatePresetItem> = [
        { presetLabel: 'Today', selectedDate: today },
        { presetLabel: 'Yesterday', selectedDate: yesterday },
        { presetLabel: '7 Days Ago', selectedDate: minus7 },
        { presetLabel: 'This Week', selectedDate: this.get1stDayOfWeek(today) },
        { presetLabel: 'Last Week', selectedDate: this.get1stDayOfWeek(minus7) },
        { presetLabel: 'This Month', selectedDate: currMonthStart },
        { presetLabel: 'Last Month', selectedDate: lastMonthStart }
      ];
      const selected = new Date(this.field.value);
      this.configStoreService.dateRangeOptions = {
        presets: preset,
        format: this.field.dateFormat,
        selectedDate: selected,
        cancelLabel: 'Close',
        displaySelected: false,
        selectApply: true
      };
      this.rangeStoreService.updateSelected(selected);
      this.changeDetectionRef.detectChanges();
    }, 10); */
  }

  private get1stDayOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 0);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  }

  openCalendar(event) {
    if (this.field && !this.field.readonly) {
      const selectedDate = new Date(this.field.value);
            /* TODO
      this.calendarOverlayService.open(
        this.calendarInput,
        'datepicker',
        { data: selectedDate }, // TODO check if corrent pass inpot data overlayParams: IccOverlayParams
        this.configStoreService.dateRangeOptions.calendarOverlayConfig,
      );


      this.calendarOverlayService.open(
        this.configStoreService.dateRangeOptions.calendarOverlayConfig,
        this.calendarInput,
        'datepicker',
        selectedDate,
      ); */
    }
  }

  public resetSelectedDate(selectedDate: Date) {
    // this.rangeStoreService.updateSelected(selectedDate);
  }

  clearSelectedDate(event) {
    this.resetSelectedDate(null);
  }

  private getFormatedDate(date: any) {
    // return new IccLocaleDatePipe(this.localeService).transform(date, this.field.dateFormat);
  }

  isValueChanged(): boolean {
    const newDate = this.getFormatedDate(this.field.value);
    const orgDate = this.getFormatedDate(this.field.orgValue);
    return newDate !== orgDate;
  }

  ngOnDestroy() {
    if (this.dateUpdate$) {
      this.dateUpdate$.unsubscribe();
    }
  }
}

