import { Validators } from '@angular/forms';
import { IccField } from './field';
import { IccFieldConfig, IccNumberType } from '../../models';
import { IccUtils } from '../../utils/utils';

export class IccNumberField extends IccField {
  private _minValue: number;
  private _maxValue: number;

  set minValue(val: number) {
    this._minValue = val;
    const find = IccUtils.findExactByKey(this.validations, 'name', 'min');
    if (!find && val) {
      this.validations.push({
        name: 'min',
        validator: Validators.min(this.minValue),
        message: `The min value is ${this.minValue}.`
      });
    }
  }

  get minValue(): number {
    return this._minValue;
  }

  set maxValue(val: number) {
    this._maxValue = val;
    const find = IccUtils.findExactByKey(this.validations, 'name', 'max');
    if (!find && val) {
      this.validations.push({
        name: 'max',
        validator: Validators.max(this.maxValue),
        message: `The max value is ${this.maxValue}.`
      });
    }
  }

  get maxValue(): number {
    return this._maxValue;
  }

  constructor(itemConfig: IccFieldConfig, itemtype: string) {
    super(itemConfig, 'number');
    const type = itemConfig.type as IccNumberType;
    this.minValue = type.minValue;
    this.maxValue = type.maxValue;
  }
}
