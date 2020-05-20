import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IccDatePickerModule, IccFormFieldModule } from 'icc';

import { DocDatePickerComponent } from './date-picker.component';


@NgModule({
  declarations: [
    DocDatePickerComponent,
  ],
  imports: [
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IccDatePickerModule,
    IccFormFieldModule,
  ],
  providers: [],
})
export class DocDatePickerModule { }
