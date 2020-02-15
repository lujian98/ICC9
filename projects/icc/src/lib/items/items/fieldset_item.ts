import { IccItem } from '../item';
import { IccFieldConfig, IccColumnConfig } from '../../models';

export class IccFieldSetItem extends IccItem {
  constructor(itemConfig: IccFieldConfig | IccColumnConfig, itemtype: string) {
    super(itemConfig, 'fieldset');
  }
}

