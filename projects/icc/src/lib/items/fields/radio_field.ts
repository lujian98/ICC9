import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IccAbstractDataService } from '../../services';
import { IccField } from './field';
import { IccFieldConfig, IccRadioType } from '../../models';

export class IccRadioField<T> extends IccField implements OnDestroy {
  private _dataSourceService: IccAbstractDataService<T>;
  private sub: Subscription;

  set dataSourceService(val: IccAbstractDataService<T>) {
    this._dataSourceService = val;
    this.setOptionsFromDataSourceService();
  }

  get dataSourceService(): IccAbstractDataService<T> {
    return this._dataSourceService;
  }

  constructor(itemConfig: IccFieldConfig, itemtype: string) {
    super(itemConfig, 'radio');
    const type = itemConfig.type as IccRadioType;
    if (type.options) {
      this.options = type.options;
    }
    if (type.dataSourceService) {
      this.dataSourceService = type.dataSourceService;
    }
  }

  private setOptionsFromDataSourceService() {
    const type = this.type as IccRadioType;
    const keyValue = type.dataSourceKeyValue ? type.dataSourceKeyValue : this.name;
    this.dataSourceService.selectionOptionRequest(keyValue, type);
    this.sub = this.dataSourceService.selectionOptionsChanged$.subscribe(
      (data: T) => { // IccSelectOption[]
        if (data && data[keyValue]) {
          this.options = data[keyValue];
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
