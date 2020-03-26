import { Component, Injectable } from '@angular/core';
import { IccFieldConfig } from '../../models';

import { IccFieldViewButtonComponent } from './button/field-view-button.component';
import { IccFieldViewCheckboxComponent } from './checkbox/field-view-checkbox.component';


@Injectable({
  providedIn: 'root'
})
export class IccFieldViewService {
  componentMapper = {
    button: IccFieldViewButtonComponent,
    checkbox: IccFieldViewCheckboxComponent
  };

  getFormFieldMapper() {
    return this.componentMapper;
  }

  getFieldView(config: IccFieldConfig): Component {
    let type = config.type || 'text';
    if (typeof type !== 'string') {
      type = type.type || 'text';
    }
    return this.componentMapper[type];
  }
}

