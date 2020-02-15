import { IccField } from './field';
import { IccFieldConfig } from '../../models';

export class IccCheckboxField extends IccField {

  constructor(itemConfig: IccFieldConfig, itemtype: string) {
    super(itemConfig, 'checkbox');
  }

  setInitialValue(value: boolean) {
    value = value ? true : false;
    super.setInitialValue(value);
  }
}

