import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { IccUtils } from '../../../utils/utils';
import { IccField } from '../../../items';
import { IccBaseGridDataSource } from '../../datasource/grid-datasource';
import { IccCellEditData } from './cell-edit.service';


@Component({
  selector: 'icc-grid-cell-edit',
  template: '',
})
export class IccCellEditComponent<T> implements OnInit, OnDestroy {
  rowHeight = 48;
  dataKeyId: string;
  field: string;
  rowIndex: number;
  colIndex: number;
  record: T;
  dataSource: IccBaseGridDataSource<T>;
  saveDebounceTime = 2500;

  private _column: IccField;
  protected _value: any;
  private _message: string;
  private _validations = [];
  private _isChangeSaved: boolean;


  saveCellEditValue$: Subject<IccCellEditData<T>> = new Subject();
  cellEditSpecialKeyEvent$: Subject<{}> = new Subject();
  valueChanged$: Subject<{}> = new Subject();


  set column(val: IccField) {
    this._column = val;
    if (val.validations instanceof Array) {
      val.validations.forEach(item => {
        this._validations.push(item.validator);
      });
    }
  }

  get column(): IccField {
    return this._column;
  }

  set value(val: T) {
    this._value = val;
  }

  get value(): T {
    return this._value;
  }

  get validations() {
    return this._validations;
  }

  set message(val: string) {
    this._message = val;
  }

  get message(): string {
    return this._message;
  }

  set isChangeSaved(val: boolean) {
    this._isChangeSaved = val;
  }

  get isChangeSaved(): boolean {
    return this._isChangeSaved;
  }

  constructor() { }

  ngOnInit(): void {
    this.valueChanged$
    .pipe(
      debounceTime(this.saveDebounceTime), distinctUntilChanged(), share()
    )
    .subscribe(() => {
      this.saveCellValue();
    });
  }

  valueChanged(event, value: T) {
    this.isChangeSaved = false;
    if (event.keyCode === 13) { // 13 is Enter
      this.saveCellValue();
    } else {
      this.value = value;
      this.isValidChange(value);
      this.valueChanged$.next(value);
    }
  }

  isValidKeyEvent(keyCode: number): boolean {
    return false;
  }

  cellEditSpecialKeyEvent(keyCode: number) {
    const data = { rowIndex: this.rowIndex, colIndex: this.colIndex, keyCode: keyCode, direction: '' };
    if (this.isValidKeyEvent(keyCode)) {
      switch (keyCode) {
        case 33:
        case 38:
          data.direction = 'up';
          break;
        case 34:
        case 40:
          data.direction = 'down';
          break;
        case 36:
        case 37:
          data.direction = 'left';
          break;
        case 35:
        case 39:
          data.direction = 'right';
          break;
      }
    }
    if (data.direction !== '') {
      this.cellEditSpecialKeyEvent$.next(data);
    }
  }
  /*
  Page up	33
  Page down	34
  End	35
  Home	36
  Left	37
  Up	38
  Right	39
  Down	40
  */
  onBlur() {
    this.saveCellValue();
  }

  isValidChange(value: T): boolean {
    const control = new FormControl(value, this.validations);
    this.message = '';
    if (control.errors) {
      Object.keys(control.errors).forEach(name => {
        const validation = IccUtils.findExactByKey(this.column.validations, 'name', name);
        if (validation) {
          this.message = validation.message;
        }
      });
    } else {
      return true;
    }
  }

  isValueChanged(): boolean { // this.isBlurred &&
    if (!this.message) {
      return true;
    }
  }

  saveCellValue() {
    if (!this.isChangeSaved && this.isValidChange(this.value) && this.isValueChanged()) {
      this.isChangeSaved = true;
      const cellData: IccCellEditData<T> = {
        dataKeyId: this.dataKeyId,
        dataKeyValue: this.record[this.dataKeyId],
        field: this.field,
        value: this.value
      }
      this.saveCellEditValue$.next(cellData);
    }
  }

  resetValue(event) {
    event.stopPropagation();
    this.value = this.record[this.column.name];
    this.message = '';
  }

  ngOnDestroy() {
    this.saveCellEditValue$.complete();
    this.cellEditSpecialKeyEvent$.complete();
    this.valueChanged$.complete();
  }
}
