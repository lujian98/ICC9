import { IccFilter } from './filter';
import { IccField } from '../../items';

export class IccCheckboxFilter extends IccFilter {
  private _checked: boolean;

  set checked(val: boolean) {
    this._checked = val;
  }

  get checked(): boolean {
    return this._checked;
  }

  constructor(column: IccField, key: string) {
    super(column, key, 'checkbox');
  }
}
