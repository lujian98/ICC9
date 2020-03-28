import { IccFieldConfig } from '../models/item-config';

export interface IccMenuItem extends IccFieldConfig {
  children?: IccMenuItem[];

  link?: string;
  routerOptions?: any;
  url?: string;
  target?: string;
  selected?: boolean;

  class?: string;

  action?: string;
  options?: any[];
  value?: string;   // value field in the options
  display?: string; // display field in the options
}
