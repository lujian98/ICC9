import { Component } from '@angular/core';
import {
  IccFieldConfig,
  IccColumnConfig,
  IccSortField,
  IccFilterField,
  IccGroupField,
  IccRendererType,
  IccEditField,
  IccSelectOption,
  IccValidation,
  IccGroupHeader
} from '../../models';
import { IccItem } from '../item';

import { IccSort } from '../../services';
import { IccUtils } from '../../utils/utils';

export abstract class IccField extends IccItem implements IccFieldConfig {
  protected _options: IccSelectOption[];

  labelPosition?: 'before' | 'after';
  value?: any;
  orgValue?: any;
  defaultValue?: any;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  icon?: string;
  children?: IccField[];
  action?: string;
  checked?: boolean; // TODO for checkbox
  // children?: IccFieldConfig[] | IccField[];

  menuField?: IccField;
  filterField?: IccFilterField | IccField;
  toolbarField?: IccField;

  sortField?: IccSortField;
  groupField: IccGroupField;
  renderer?: IccRendererType;
  style?: {};
  editField?: IccEditField;
  cellReadonly?: boolean | Function;
  validations?: IccValidation[] = [];
  width?: number;
  fixedWidth?: boolean | 'auto';
  minWidth?: number;
  dragDisabled?: boolean;
  align?: string;
  priority?: number;
  sticky?: boolean;
  stickyEnd?: boolean;
  menu?: boolean | IccFieldConfig;
  cellMenu?: boolean | IccFieldConfig;
  dateFormat?: string;
  groupHeader?: IccGroupHeader;

  sort?: IccSort;
  columnFilter?: Component;

  left?: string | 'auto' = 'auto';
  right?: string | 'auto' = 'auto';

  set options(val: IccSelectOption[]) {
    this._options = val;
  }

  get options(): IccSelectOption[] {
    return this._options;
  }

  get isValueChanged(): boolean {
    return this.orgValue !== this.value;
  }

  constructor(itemConfig: IccColumnConfig, itemtype: string) {
    super(itemConfig, itemtype);
    if (!itemConfig.width) {
      itemConfig.width = 100;
    }
    // if (!itemConfig.fixedWidth && itemConfig.fixedWidth !== false) {
    //  itemConfig.fixedWidth = 'auto';
    // }
    if (!itemConfig.minWidth) {
      itemConfig.minWidth = 100;
    }
    if (itemConfig.fixedWidth === true) {
      itemConfig.minWidth = itemConfig.width;
    }
    if (itemConfig.width < itemConfig.minWidth) {
      itemConfig.minWidth = itemConfig.width;
    }
    this.itemConfig = itemConfig;
    Object.assign(this, itemConfig);
    if (itemConfig.hidden === 'never') {
      this.hidden = false;
    }
  }

  getSelectedLabel(value: string): string {
    const selected: IccSelectOption = IccUtils.findExactByKey(this.options, 'value', value);
    return selected ? selected.label : '';
  }

  getSelectedDetail(value: string): string {
    const selected: IccSelectOption = IccUtils.findExactByKey(this.options, 'value', value);
    return selected ? selected.detail || selected.label : '';
  }

  getCheckedValue(value: any): any {
    return value;
  }

  setInitialValue(value: any) {
    this.value = this.orgValue = value;
  }
}
