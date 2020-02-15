import { IccField } from '../../items';

export abstract class IccFilter {
  protected column: IccField;
  private _key: string;
  private _field: string;
  private _type: string;
  private _enabled: boolean;
  protected _search: string;

  set key(val: string) {
    this._key = val;
  }

  get key(): string {
    return this._key;
  }

  set field(val: string) {
    this._field = val;
  }

  get field(): string {
    return this._field;
  }

  set type(val: string) {
    this._type = val;
  }

  get type(): string {
    return this._type;
  }

  set enabled(val: boolean) {
    this._enabled = val;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set search(val: string) {
    this._search = val;
  }

  get search(): string {
    return this._search;
  }

  constructor(column: IccField, field: string, type: string) {
    this.column = column;
    this.key = column.name;
    this.field = field; // filter field can be different from the key - column field
    this.type = type;
    this.enabled = column.filterField ? true : false;
    this.search = '';
  }
}
