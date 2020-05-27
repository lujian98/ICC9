import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/'; TODOv9

import { OverlayModule } from '@angular/cdk/overlay';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeJa from '@angular/common/locales/ja';
import localeDe from '@angular/common/locales/de';
import localeZh from '@angular/common/locales/zh';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeEn, 'en');
registerLocaleData(localeJa, 'ja');
registerLocaleData(localeDe, 'de');
registerLocaleData(localeZh, 'zh');
registerLocaleData(localeFr, 'fr');

import { IccDatePickerComponent } from './date-picker/date-picker.component';
import { IccDateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { IccDatePickerOverlayComponent } from './picker-overlay/date-picker-overlay.component';
import { IccDateRangePickerOverlayComponent } from './picker-overlay/date-range-picker-overlay.component';

import { IccCalendarWrapperComponent } from './calendar-wrapper/calendar-wrapper.component';
import { IccCalendarPresetsComponent } from './calendar-presets/calendar-presets.component';
import { DATE } from './services/date-range-store.service';

import { IccFormFieldModule } from '../form-field/form-field.module';
import { IccPipesModule, IccLocaleDatePipe } from '../../pipes/index';

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OverlayModule,
    IccFormFieldModule,
    IccPipesModule,
  ],
  declarations: [
    IccDateRangePickerComponent,
    IccDatePickerComponent,
    IccCalendarWrapperComponent,
    IccDatePickerOverlayComponent,
    IccDateRangePickerOverlayComponent,
    IccCalendarPresetsComponent,
  ],
  providers: [
    IccLocaleDatePipe,
    { provide: DATE, useValue: new Date() },
    // { provide: MAT_DATE_LOCALE, useValue: 'en-US' } TODOv9
  ],
  entryComponents: [
    IccDatePickerOverlayComponent,
    IccDateRangePickerOverlayComponent
  ],
  exports: [
    IccDateRangePickerComponent,
    IccDatePickerComponent,
  ]
})
export class IccDatePickerModule { }
