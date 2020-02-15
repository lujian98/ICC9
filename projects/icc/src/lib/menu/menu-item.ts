export class IccMenuItem {
  title?: string;
  link?: string;
  routerOptions?: any;
  url?: string;
  icon?: string;
  children?: IccMenuItem[];
  target?: string;
  selected?: boolean;

  class?: string;
  type?: string;
  hidden?: boolean;
  name?: string;
  action?: string;
  disabled?: boolean;
  options?: any[];
  value?: string;   // value field in the options
  display?: string; // display field in the options
  // optionValue?: string;
  // optionType?: string;
  // optionDisplay?: string;
}
