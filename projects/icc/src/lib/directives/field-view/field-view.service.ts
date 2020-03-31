import { Component, Injectable } from '@angular/core';
import { IccFieldConfig } from '../../models';

import { IccFieldViewButtonComponent } from './button/field-view-button.component';
import { IccFieldViewCheckboxComponent } from './checkbox/field-view-checkbox.component';
import { IccFieldViewTextComponent } from './text/field-view-text.component';

@Injectable({
  providedIn: 'root'
})
export class IccFieldViewService {
  componentMapper = {
    button: IccFieldViewButtonComponent,
    checkbox: IccFieldViewCheckboxComponent,
    text: IccFieldViewTextComponent
  };

  getFormFieldMapper() {
    return this.componentMapper;
  }

  getFieldView(config: IccFieldConfig): Component {
    // console.log( ' xx config=', config)
    let type = config.type || 'text';
    if (typeof type !== 'string') {
      type = type.type || 'text';
    }
    // console.log( ' yy type=', type)
    return this.componentMapper[type];
  }
}

