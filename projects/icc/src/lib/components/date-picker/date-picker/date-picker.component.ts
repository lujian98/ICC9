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
import { IccDatePickerOverlayComponent } from '../picker-overlay/date-picker-overlay.component';
import { IccOverlayService } from '../../../services/overlay/overlay.service';
import { IccDateRangeStoreService } from '../services/date-range-store.service';
import { IccDateRangeOptions } from '../model/model';
import { IccDateConfigStoreService } from '../services/date-config-store.service';
import { Subscription } from 'rxjs';
import { IccLocaleService } from '../../../services/locale/locale.service';

@Component({
  selector: 'icc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    IccOverlayService,
    IccDateRangeStoreService,
    IccDateConfigStoreService,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IccDatePickerComponent<T> implements OnInit, OnDestroy {
  @Input() options: IccDateRangeOptions;
  @ViewChild('calendarInput') calendarInput;
  @Output() readonly selectedDateChanged: EventEmitter<Date> = new EventEmitter<Date>();

  selectedDate = '';
  private dateUpdate$: Subscription;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private overlayService: IccOverlayService<T>,
    public rangeStoreService: IccDateRangeStoreService,
    public configStoreService: IccDateConfigStoreService,
    private localeService: IccLocaleService,
  ) { }

  ngOnInit() {
    this.configStoreService.dateRangeOptions = this.options;
    this.options.placeholder = this.options.placeholder || 'Select a date';
    this.options.locale = this.options.locale || 'en-US';

    this.dateUpdate$ = this.rangeStoreService.updateSelected$.subscribe(selectedDate => {
      if (selectedDate) {
        const locale = this.localeService.locale;
        this.options.locale = locale;
        const selected: string = new DatePipe(locale).transform(selectedDate, this.options.format);
        this.selectedDate = `${selected}`;
      } else {
        this.selectedDate = '';
      }
      this.selectedDateChanged.emit(selectedDate);
    });

    this.rangeStoreService.updateSelected(this.options.selectedDate);
    this.changeDetectionRef.detectChanges();
  }

  openCalendar(event) {
    const config = {
      panelClass: 'icc-date-picker-overlay',
      hasBackdrop: true,
      backdropClass: 'icc-date-picker-overlay-backdrop',
      shouldCloseOnBackdropClick: true
    };

    this.overlayService.open(
      this.calendarInput,
      IccDatePickerOverlayComponent,
      config
      // this.options.calendarOverlayConfig, // TODO config from option???
    );
  }

  public resetSelectedDate(selectedDate: Date) {
    this.rangeStoreService.updateSelected(selectedDate);
  }

  clearSelectedDate(event) {
    this.resetSelectedDate(null);
  }

  ngOnDestroy() {
    if (this.dateUpdate$) {
      this.dateUpdate$.unsubscribe();
    }
  }
}
