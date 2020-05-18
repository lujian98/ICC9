import { IccFilter } from './filter';
import { IccField } from '../../items';
import { IccDateRange } from '../../components/date-picker/model/model';

export class IccDateFilter extends IccFilter {
  private _range: IccDateRange;

  set range(val: IccDateRange) {
    this._range = val;
  }

  get range(): IccDateRange {
    return this._range;
  }

  constructor(column: IccField, key: string) {
    super(column, key, 'date');
  }
}
