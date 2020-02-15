import { Injectable } from '@angular/core';
import { IccItemConfig } from '../models';
import { IccCheckboxField } from './fields/checkbox_field';
import { IccDateField } from './fields/date_field';
import { IccNumberField } from './fields/number_field';
import { IccRadioField } from './fields/radio_field';
import { IccSelectField } from './fields/select_field';
import { IccTextField } from './fields/text_field';
import { IccFieldSetItem } from './items/fieldset_item';

@Injectable({
  providedIn: 'root'
})
export class IccItemFieldService {
  componentMapper: {};

  constructor() {
    this.componentMapper = {
      fieldset: IccFieldSetItem,
      date: IccDateField,
      checkbox: IccCheckboxField,
      number: IccNumberField,
      radio: IccRadioField,
      select: IccSelectField,
      text: IccTextField,
    };
  }

  getItem(itemConfig: IccItemConfig) {
    const type = itemConfig.type;
    const itemtype = typeof type === 'string' ? type : type.type;
    let component = this.componentMapper[itemtype];
    if (!component) {
      component = this.componentMapper['text'];
    }
    const componentRef = new component(itemConfig, itemtype);
    return componentRef;
  }
}

