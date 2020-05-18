import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { OverlayRef } from '@angular/cdk/overlay';
import { IccOverlayService } from '../../../services/overlay/overlay.service';
import { IccOverlayConfig } from '../../../services/overlay/overlay.model';

// import { IccCalendarOverlayService } from '../services/calendar-overlay.service';
import { IccBaseOverlayService } from '../services/overlay.service';

import { IccDateRangeStoreService } from '../services/date-range-store.service';
import { IccDateRange, IccDateRangeOptions } from '../model/model';
import { IccDateConfigStoreService } from '../services/date-config-store.service';
import { Subscription } from 'rxjs';
import { IccLocaleService } from '../services/locale.service';
import { IccDateRangePickerOverlayComponent } from '../picker-overlay/date-range-picker-overlay.component';


@Component({
  selector: 'icc-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    // IccCalendarOverlayService,
    IccBaseOverlayService,
    IccDateRangeStoreService,
    IccDateConfigStoreService,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IccDateRangePickerComponent<T> implements OnInit, OnDestroy {
  @ViewChild('calendarInput')
  calendarInput;
  @Output()
  readonly selectedDateRangeChanged: EventEmitter<IccDateRange> = new EventEmitter<IccDateRange>();
  @Input()
  options: IccDateRangeOptions;
  private rangeUpdate$: Subscription;
  selectedDateRange = '';

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private calendarOverlayService: IccBaseOverlayService,
    private overlayService: IccOverlayService<T>,
    public rangeStoreService: IccDateRangeStoreService,
    public configStoreService: IccDateConfigStoreService,
    private localeService: IccLocaleService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.configStoreService.dateRangeOptions = this.options;
    this.options.placeholder = this.options.placeholder || 'Choose a date range';
    this.options.locale = this.options.locale || 'en-US';

    this.rangeUpdate$ = this.rangeStoreService.rangeUpdate$.subscribe(range => {
      if (range.fromDate && !range.toDate) {
        range.toDate = range.fromDate;
      } else if (!range.fromDate && range.toDate) {
        range.fromDate = range.toDate;
      }
      const locale = this.localeService.locale;
      this.options.locale = locale;
      const from: string = new DatePipe(locale).transform(range.fromDate, this.options.format);
      const to: string = new DatePipe(locale).transform(range.toDate, this.options.format);
      if (range.fromDate && range.toDate) {
        this.selectedDateRange = `${from} - ${to}`;
      } else {
        this.selectedDateRange = '';
      }
      this.selectedDateRangeChanged.emit(range);
    });

    this.rangeStoreService.updateRange(
      this.options.range.fromDate,
      this.options.range.toDate
    );
    this.changeDetectionRef.detectChanges();
  }

  private formatToDateString(date: Date, format: string): string {
    return this.datePipe.transform(date, format);
  }

  openCalendar(event) {
    // const overlayRef: OverlayRef = this.calendarOverlayService.open(
    /* TODO
this.calendarOverlayService.open(
  this.calendarInput,
  'daterangepicker',
  {}, // TODO pass inpot data overlayParams: IccOverlayParams
  this.options.calendarOverlayConfig,

    open(config: IccOverlayConfig = {}, hostElemRef: ElementRef, portal: string, configData?: {}): OverlayRef {
this.hostElemRef = hostElemRef;
const overlayConfig = { ...DEFAULT_CONFIG, ...config };
const overlayRef = this.createOverlay(overlayConfig);
const portalInjector = this.createInjector(overlayRef);
const component = this.getPortalComponent(portal);
const componentPortal = new ComponentPortal(
component,
null,
portalInjector
);

);  */

    /*
          const overlayConfig: IccOverlayConfig = {
      position: this.popoverPosition,
      width: this.width,
      height: this.height
    };
    this.overlayRef = this.overlayService.open(
      this.elementRef.nativeElement,
      IccPortalComponent,
      overlayConfig,
      this.content,
      this.context
    );





    const overlayConfig: IccOverlayConfig = {
      panelClass: 'icc-overlay',
      hasBackdrop: true,
      backdropClass: 'icc-overlay-backdrop',
      shouldCloseOnBackdropClick: true
    };

    this.overlayService.open(
      this.calendarInput,
      IccDateRangePickerOverlayComponent,
      overlayConfig
    );
        */

    this.calendarOverlayService.open(
      this.options.calendarOverlayConfig,
      this.calendarInput,
      IccDateRangePickerOverlayComponent
    );

  }

  public resetDates(range: IccDateRange) {
    this.rangeStoreService.updateRange(
      range.fromDate,
      range.toDate
    );
  }

  clearDateRange(event) {
    const range = { fromDate: null, toDate: null };
    this.resetDates(range);
  }

  ngOnDestroy() {
    if (this.rangeUpdate$) {
      this.rangeUpdate$.unsubscribe();
    }
  }
}
