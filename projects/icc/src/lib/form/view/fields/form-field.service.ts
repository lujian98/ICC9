import { Component, Injectable } from '@angular/core';
import { IccFieldConfig } from '../../../models';

import { IccFormTextComponent } from './text/form-text.component';
import { IccFormNumberComponent } from './number/form-number.component';
import { IccFormSelectComponent } from './select/form-select.component';
import { IccFormDateComponent } from './date/form-date.component';
import { IccFormRadioComponent } from './radio/form-radio.component';
import { IccFormCheckboxComponent } from './checkbox/form-checkbox.component';

// import { ButtonComponent } from './button/button.component';

// import { AutocompleteComponent } from "./autocomplete/autocomplete.component"
// import { MulticheckboxComponent } from "./multicheckbox/multicheckbox.component"
// import { TimeComponent } from './time/time.component';
// import { HiddenComponent } from './hidden/hidden.component';
// import { DisplayComponent } from './display/display.component';

@Injectable({
  providedIn: 'root'
})
export class IccFormFieldService {
  componentMapper = {
    text: IccFormTextComponent,
    number: IccFormNumberComponent,
    select: IccFormSelectComponent,
    date: IccFormDateComponent,
    radio: IccFormRadioComponent,
    checkbox: IccFormCheckboxComponent

    // autocomplete: AutocompleteComponent,
    // multicheckbox: MulticheckboxComponent,

    // time: TimeComponent,
    // hidden: HiddenComponent,
    // display: DisplayComponent,
    // button: ButtonComponent,
  };

  getFormFieldMapper() {
    return this.componentMapper;
  }

  // Do not support serverity for the form field
  getFormField(index: number, config: IccFieldConfig): Component {
    let type = config.type || 'text';
    if (typeof type !== 'string') {
      type = type.type || 'text';
    }
    return this.componentMapper[type];
  }
}

