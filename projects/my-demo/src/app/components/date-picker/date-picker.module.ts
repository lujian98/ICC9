import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/*
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material'; */

import { IccDatePickerModule } from 'icc';

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
  ],
  providers: [],
})
export class DocDatePickerModule { }
