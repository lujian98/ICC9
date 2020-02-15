import { IccType } from '../../models';
import { IccField } from '../../items';

export class IccSort {

  readonly ASC = 'asc';
  readonly DESC = 'desc';

  private _sortField: string;
  private _fieldType: string | IccType;

  set fieldType(val: string | IccType) {
    this._fieldType = val;
  }

  get fieldType(): string | IccType {
    return this._fieldType;
  }

  set key(val: string) {
    this._key = val;
  }

  get key(): string {
    return this._key;
  }

  set sortField(val: string) {
    this._sortField = val;
  }

  get sortField(): string {
    return this._sortField;
  }

  set direction(val: string) {
    this._direction = val;
  }

  get direction(): string {
    return this._direction;
  }

  set active(val: boolean) {
    this._active = val;
  }

  get active(): boolean {
    return this._active;
  }

  constructor(
    private column: IccField,
    private _key: string,
    private _direction: string,
    private _active: boolean
  ) {
    this.sortField = (typeof column.sortField === 'string') ? column.sortField : column.name;
    this.fieldType = column.type;
  }

  convertDirection() {
    switch (this.direction) {
      case this.ASC: {
        return 'asc';
      }
      case this.DESC: {
        return 'desc';
      }
    }
  }
}

