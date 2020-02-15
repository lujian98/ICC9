import { IccFilter } from './filter';
import { IccField } from '../../items';

export enum NumericFilterActions {
  NOT_NULL = 'NOT_NULL',
  NULL = 'NULL',
  GTE = 'GTE',
  GT = 'GT',
  LTE = 'LTE',
  LT = 'LT',
  EQ = 'EQ',
  INCLUDES = 'INCLUDES'
}

export class IccNumberFilter extends IccFilter {
  protected _value: number;
  protected _action: NumericFilterActions;

  // always call the value first, then action
  get value(): number {
    this.setValue(this.search);
    return this._value;
  }

  get action(): NumericFilterActions {
    return this._action;
  }

  constructor(column: IccField, key: string) {
    super(column, key, 'number');
  }

  setValue(search: string) {
    if (search !== null && search !== '') {
      const str = search.replace(/\s/g, '');
      if (str) {
        const filter = Number(search.replace(/[^0-9.-]/g, ''));
        if (str.includes('!null')) {
          this._value = null;
          this._action = NumericFilterActions.NOT_NULL;
        } else if (str.includes('null')) {
          this._value = null;
          this._action = NumericFilterActions.NULL;
        } else {
          if (str.includes('>=')) {
            this._value = filter;
            this._action = NumericFilterActions.GTE;
          } else if (str.includes('<=')) {
            this._value = filter;
            this._action = NumericFilterActions.LTE;
          } else if (str.includes('>')) {
            this._value = filter;
            this._action = NumericFilterActions.GT;
          } else if (str.includes('<')) {
            this._value = filter;
            this._action = NumericFilterActions.LT;
          } else if (str.includes('=')) {
            this._value = filter;
            this._action = NumericFilterActions.EQ;
          } else {
            this._value = filter;
            this._action = NumericFilterActions.EQ; // Default to EQ
          }
        }
        return;
      }
    }
    this._action = null;
    this._value = null;
  }
}
