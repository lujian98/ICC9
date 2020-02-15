import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IccField } from './field';
import { IccFieldConfig, IccSelectOption, IccSelectType } from '../../models';
import { IccAbstractDataService } from '../../services';
import { IccUtils } from '../../utils/utils';

export class IccSelectField<T> extends IccField implements OnDestroy {
  private _multiSelect = false;
  private _filterMultiSelect = false;
  private _dataSourceService: IccAbstractDataService<T>;
  private sub: Subscription;

  set multiSelect(val: boolean) {
    this._multiSelect = val;
  }

  get multiSelect(): boolean {
    return this._multiSelect;
  }

  set filterMultiSelect(val: boolean) {
    this._filterMultiSelect = val;
  }

  get filterMultiSelect(): boolean {
    return this._filterMultiSelect;
  }

  /*
  set options(val: IccSelectOption[]) {
    this._options = val;
  }

  get options(): IccSelectOption[] {
    return this._options;
  } */

  set dataSourceService(val: IccAbstractDataService<T>) {
    this._dataSourceService = val;
    this.setOptionsFromDataSourceService();
  }

  get dataSourceService(): IccAbstractDataService<T> {
    return this._dataSourceService;
  }

  constructor(itemConfig: IccFieldConfig, itemtype: string) {
    super(itemConfig, 'select');
    const type = itemConfig.type as IccSelectType;
    this.multiSelect = type.multiSelect;
    this.filterMultiSelect = type.filterMultiSelect;
    if (type.options) {
      this.options = type.options;
    }
    if (type.dataSourceService) {
      this.dataSourceService = type.dataSourceService;
    }
  }

  private setOptionsFromDataSourceService() {
    const type = this.type as IccSelectType;
    const keyValue = type.dataSourceKeyValue ? type.dataSourceKeyValue : this.name;
    this.dataSourceService.selectionOptionRequest(keyValue, type);
    this.sub = this.dataSourceService.selectionOptionsChanged$.subscribe((data: T) => {
      if (data && data[keyValue]) {
        this.options = data[keyValue];
      }
    });
  }

  getSelectedLabel(value: any): string {
    value = this.getCheckedValue(value);
    let rvalue: string;
    if (this.multiSelect) {
      rvalue = value.map((val: string) => {
        return this.getEachSelectLabel(val);
      });
    } else {
      rvalue = this.getEachSelectLabel(value);
    }
    return rvalue ? rvalue : value;
  }

  getEachSelectLabel(value: string): string {
    const selected: IccSelectOption = IccUtils.findExactByKey(this.options, 'value', value);
    if (selected) {
      return selected.label;
    }
  }

  getCheckedValue(value: any): any {
    if (this.multiSelect && !(value instanceof Array)) {
      if (value && typeof value === 'string') {
        return value.split(',');
      } else {
        return [];
      }
    } else if (!this.multiSelect && value instanceof Array) {
      if (value.length > 0) {
        return value.join(',');
      } else {
        return '';
      }
    }
    return value;
  }

  setInitialValue(value: any) {
    this.value = this.orgValue = this.getCheckedValue(value);
  }


  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
