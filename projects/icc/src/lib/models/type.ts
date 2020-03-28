import { IccAbstractDataService } from '../services';

export type itemType = 'text' | 'number' | 'select' | 'radio' | 'fieldset' | 'checkbox' | 'button';

export interface IccSelectOption {
  label: string;
  value: string | number;
  detail?: string;
}

export interface IccType {
  type: itemType;
}

export interface IccTextType extends IccType {
  inputType?: string;
  minLength?: number;
  maxLength?: number;
}

export interface IccNumberType extends IccType {
  minValue?: number;
  maxValue?: number;
}

// export interface IccCheckboxType extends IccType {
//  checked?: boolean;
// }

export interface IccSelectType extends IccType {
  multiSelect?: boolean;
  filterMultiSelect?: boolean;
  allowBlank?: boolean;
  options?: IccSelectOption[];
  dataSourceService?: IccAbstractDataService<any>;
  dataSourceKeyValue?: string;
  dataSourceKey?: string;
  dataSourceUrl?: string;
  dataSourcePath?: string;
}

export interface IccRadioType extends IccType {
  allowBlank?: boolean;
  options?: IccSelectOption[];
  dataSourceService?: IccAbstractDataService<any>;
  dataSourceKeyValue?: string;
  dataSourceKey?: string;
  dataSourceUrl?: string;
  dataSourcePath?: string;
}

export interface IccGridConfigs {
  gridTableID?: string;
  enableCellEdit?: boolean;
  enableColumnDnD?: boolean;
  enableColumnFilter?: boolean;
  enableColumnHide?: boolean;
  enableColumnResize?: boolean;
  enableColumnSort?: boolean;
  enableColumnSticky?: boolean;
  enableGridSideMenu?: boolean;
  enableMultiColumnSort?: boolean;
  enableMultiRowGroup?: boolean;
  enableMultiRowSelection?: boolean;
  enableRowGroup?: boolean;
  enableRowSelection?: boolean;
  enableDisplayGridSummary?: boolean;

  dataKeyId?: string;
  defaultSort?: string;
  defaultSortDir?: string;
  filteredValues?: {};
  rowHeight?: number;

}

export interface IccTableConfigs {
  tableId?: string;
  tableType?: string;
  enableCellEdit?: boolean;
  enableColumnDnD?: boolean;
  enableColumnFilter?: boolean;
  enableColumnHide?: boolean;
  enableColumnResize?: boolean;
  enableColumnSort?: boolean;
  enableColumnSticky?: boolean;
  enableGridSideMenu?: boolean;
  enableMultiColumnSort?: boolean;
  enableMultiRowGroup?: boolean;
  enableMultiRowSelection?: boolean;
  enableRowGroup?: boolean;
  enableRowSelection?: boolean;
  enableDisplayGridSummary?: boolean;
  enableTableHeader?: boolean;

  dataKeyId?: string;
  defaultSort?: string;
  defaultSortDir?: string;
  filteredValues?: {};
  rowHeight?: number;

  isNestedData?: boolean;
  width?: number; // if tree panel without table header
  columnHeaderPosition?: number;
}