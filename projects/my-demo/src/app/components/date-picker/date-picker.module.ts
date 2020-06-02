import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IccDatePickerModule, IccFormFieldModule, IccActiveModule } from 'icc';

import { DocDatePickerComponent } from './date-picker.component';
import { NavigableListItemDirective } from './navigable-list-item.directive';

@NgModule({
  declarations: [
    DocDatePickerComponent,
    NavigableListItemDirective,
  ],
  imports: [
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IccDatePickerModule,
    IccFormFieldModule,
    IccActiveModule
  ],
  providers: [],
})
export class DocDatePickerModule { }
