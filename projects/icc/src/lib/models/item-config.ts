import { Component } from '@angular/core';
import { IccGroupHeader } from './group-header';
import { IccValidation } from './validation';
import {
  IccType,
  IccTextType,
  IccNumberType,
  IccSelectType,
  IccRadioType
} from './type';
import { IccField } from '../items';

export type IccSortField = boolean | string;
export type IccFilterField = boolean | string;
export type IccGroupField = boolean | string;
export type IccRendererType = string | Function | Component;
export type IccEditField = boolean | string;

export interface IccItemConfig {
  name?: string; // TODO name is optional now, it should required at the final
  type?: string | IccType | IccTextType | IccNumberType | IccSelectType | IccRadioType;
  title?: string;
  titleClass?: string;
  icon?: string;
  index?: number; // auto generated
  hidden?: boolean | string; // column hidden: 'always' will hide always, 'never' will visible always
  disabled?: boolean;
  action?: string;
  checked?: boolean; // for checkbox
}

export interface IccFieldConfig extends IccItemConfig {
  dateFormat?: string;
  validations?: IccValidation[];
  align?: string;
  width?: number;
  editField?: IccEditField;

  labelPosition?: 'before' | 'after'; // for checkbox and maybe other's if needed above/below etc.
  value?: any;
  orgValue?: any;
  defaultValue?: any;
  placeholder?: string;
  readonly?: boolean;
  children?: IccFieldConfig[] | IccField[];
  fieldConfig?: IccFieldConfig, // for toolbar menu conffig

  // allowBlank?: boolean;
}

export interface IccColumnConfig extends IccFieldConfig {
  sortField?: IccSortField;
  filterField?: IccFilterField;
  groupField?: IccGroupField;
  renderer?: IccRendererType;
  style?: {};
  cellReadonly?: boolean | Function;
  fixedWidth?: boolean | 'auto';
  minWidth?: number;
  dragDisabled?: boolean;
  priority?: number;
  stickyable?: boolean;
  sticky?: boolean;
  stickyEnd?: boolean;
  menu?: boolean | IccFieldConfig,
  cellMenu?: boolean | IccFieldConfig;
  groupHeader?: IccGroupHeader;
  left?: string | 'auto';
  right?: string | 'auto';
}
