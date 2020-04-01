import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IccDatePickerModule } from '../date-picker/date-picker.module';
// import { ButtonComponent } from './fields/button/button.component'
// import { AutocompleteComponent } from "./fields/autocomplete/autocomplete.component"
// import { MulticheckboxComponent } from "./fields/multicheckbox/multicheckbox.component"
// import { TimeComponent } from './fields/time/time.component'
// import { HiddenComponent } from './fields/hidden/hidden.component'
// import { DisplayComponent } from './fields/display/display.component'
import { IccLocaleDatePipe } from '../pipes/locale-date.pipe';
import { IccFormComponent } from './form.component';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/datepicker/'; TODOv9
import { MatSelectModule } from '@angular/material/select';
// import { MatOptionModule } from '@angular/material/select'; TODOv9
import { MatRadioModule } from '@angular/material/radio';


import { IccFieldsViewComponent } from './view/fields-view.component';
import { IccFormCheckboxComponent } from './view/fields/checkbox/form-checkbox.component';
import { IccFormDateComponent } from './view/fields/date/form-date.component';
import { IccFormFieldComponent } from './view/fields/form-field.component';
import { IccFormFieldDirective } from './view/fields/form-field.directive';
import { IccFormNumberComponent } from './view/fields/number/form-number.component';
import { IccFormRadioComponent } from './view/fields/radio/form-radio.component';
import { IccFormSelectComponent } from './view/fields/select/form-select.component';
import { IccFormTextComponent } from './view/fields/text/form-text.component';
import { IccFormViewComponent } from './view/form-view.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatSelectModule,
    // MatOptionModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatTooltipModule,
/*
    ButtonModule,
    DialogModule,
    TableModule,
    MultiSelectModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    DropdownModule,
    MenuModule,
    InputTextModule,
    MessagesModule, */
    ReactiveFormsModule,
    IccDatePickerModule,
  ],
  declarations: [
    IccFormComponent,
    IccFormViewComponent,
    IccFieldsViewComponent,

    IccFormFieldDirective,
    IccFormFieldComponent,
    IccFormTextComponent,
    IccFormNumberComponent,
    IccFormSelectComponent,
    IccFormDateComponent,
    IccFormRadioComponent,
    IccFormCheckboxComponent,

    // ButtonComponent,
    // AutocompleteComponent,
    // MulticheckboxComponent,
    // TimeComponent,
    // HiddenComponent,
    // DisplayComponent,
  ],
  exports: [
    IccFormComponent,
    IccFormViewComponent,
    IccFieldsViewComponent,

    IccFormFieldDirective,
    IccFormFieldComponent,
    IccFormTextComponent,
    IccFormNumberComponent,
    IccFormSelectComponent,
    IccFormDateComponent,
    IccFormRadioComponent,
    IccFormCheckboxComponent,


    // ButtonComponent,

    // AutocompleteComponent,
    // MulticheckboxComponent,
    // TimeComponent,
    // HiddenComponent,
    // DisplayComponent,
  ],
  entryComponents: [
    IccFormFieldComponent,
    IccFormTextComponent,
    IccFormNumberComponent,
    IccFormSelectComponent,
    IccFormDateComponent,
    IccFormRadioComponent,
    IccFormCheckboxComponent,


    // ButtonComponent,
     // AutocompleteComponent,
    // MulticheckboxComponent,
    // TimeComponent,
    // HiddenComponent,
    // DisplayComponent
  ],
  providers: [DatePipe, IccLocaleDatePipe],
})

export class IccFormModule { }

