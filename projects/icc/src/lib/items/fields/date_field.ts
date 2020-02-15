import { IccField } from './field';
import { IccFieldConfig } from '../../models';

export class IccDateField extends IccField {
  constructor(itemConfig: IccFieldConfig, itemtype: string) {
    super(itemConfig, 'date');
    if (!this.dateFormat) {
      this.dateFormat = 'mediumDate';
    }
  }
}
