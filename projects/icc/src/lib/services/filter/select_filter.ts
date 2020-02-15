import { IccFilter } from './filter';
import { IccSelectType } from '../../models';
import { IccField } from '../../items';

export class IccSelectFilter<T> extends IccFilter {
  private _choices: any[] = [];
  private _multiSelect = false;

  set multiSelect(val: boolean) {
    this._multiSelect = val;
  }

  get multiSelect(): boolean {
    return this._multiSelect;
  }

  // since the set search can only call at parent, the choices need to set when call
  get choices(): any[] {
    this._choices = this.search ? this.search.split(',') : [];
    return this._choices;
  }

  constructor(column: IccField, key: string) {
    super(column, key, 'select');
    const type = column.type as IccSelectType;
    this.multiSelect = type.filterMultiSelect;
  }
}
