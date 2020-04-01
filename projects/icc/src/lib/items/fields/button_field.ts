import { IccFieldConfig } from '../../models';
import { IccField } from './field';

export class IccButtonField extends IccField {
  constructor(itemConfig: IccFieldConfig, itemtype: string) {
    super(itemConfig, 'button');
  }
}
