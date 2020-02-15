import { Validators } from '@angular/forms';
import { IccField } from './field';
import { IccFieldConfig, IccTextType } from '../../models';
import { IccUtils } from '../../utils/utils';

export class IccTextField extends IccField {
  private _inputType: string;
  private _minLength: number;
  private _maxLength: number;

  set inputType(val: string) {
    this._inputType = val;
  }

  get inputType(): string {
    return this._inputType;
  }

  set minLength(val: number) {
    this._minLength = val;
    const find = IccUtils.findExactByKey(this.validations, 'name', 'min');
    if (!find && val && val > 0) {
      this.validations.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'The field cannot be empty.'
        },
        {
          name: 'minlength',
          validator: Validators.minLength(this.minLength),
          message: `The min length value is ${this.minLength}.`
        }
      );
    }
  }

  get minLength(): number {
    return this._minLength;
  }

  set maxLength(val: number) {
    this._maxLength = val;
    const find = IccUtils.findExactByKey(this.validations, 'name', 'max');
    if (!find && val) {
      this.validations.push({
        name: 'maxlength',
        validator: Validators.maxLength(this.maxLength),
        message: `The max length value is ${this.maxLength}.`
      });
    }
  }

  get maxLength(): number {
    return this._maxLength;
  }

  constructor(itemConfig: IccFieldConfig, itemtype: string) {
    super(itemConfig, 'text');
    const type = itemConfig.type as IccTextType;
    this.inputType = type.inputType || 'text';
    this.minLength = type.minLength;
    this.maxLength = type.maxLength;
  }
}
