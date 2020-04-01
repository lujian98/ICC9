import {
  IccItemConfig,
  IccColumnConfig,
  IccType,
  IccTextType,
  IccNumberType,
  IccSelectType,
  IccRadioType,
} from '../models';

export abstract class IccItem implements IccItemConfig {
  private _itemConfig: IccColumnConfig;
  private _itemtype: string;

  name: string;
  type?: string | IccType | IccTextType | IccNumberType | IccSelectType | IccRadioType;
  title?: string;
  titleClass?: string;
  index?: number;
  hidden?: boolean | string; // column hidden: 'always' will hide always, 'never' will visible always

  set itemConfig(val: IccColumnConfig) {
    this._itemConfig = val;
  }

  get itemConfig(): IccColumnConfig {
    return this._itemConfig;
  }

  set itemtype(val: string) {
    this._itemtype = val;
  }

  get itemtype(): string {
    return this._itemtype;
  }

  constructor(itemConfig: IccItemConfig | IccColumnConfig, itemtype: string) {
    if (!itemConfig.title) {
      itemConfig.title = itemConfig.name;
    }
    this.itemConfig = itemConfig;
    this.itemtype = itemtype;
    Object.assign(this, itemConfig);
  }
}
