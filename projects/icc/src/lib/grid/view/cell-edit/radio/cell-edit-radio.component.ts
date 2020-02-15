import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IccCellEditComponent } from '../cell-edit.component';
import { IccRadioField } from '../../../../items';
import { IccUtils } from '../../../../utils/utils';

@Component({
  selector: 'icc-cell-edit-radio',
  templateUrl: './cell-edit-radio.component.html',
  styleUrls: ['./cell-edit-radio.component.scss']

})
export class IccCellEditRadioComponent<T> extends IccCellEditComponent<T> implements AfterViewInit {
  column: IccRadioField<T>;
  private _displayValue = '';

  @ViewChild('cellInput') cellInput: ElementRef;

  set value(val: any) {
    this._value = val;
    const option = IccUtils.findExactByKey(this.column.options, 'value', val);
    if (option) {
      this.displayValue = option.label;
    }
  }

  get value(): any { // set and get must together
    return this._value;
  }

  set displayValue(val: string) {
    this._displayValue = val;
    this.setCellInputHeight();
  }

  get displayValue(): string {
    return this._displayValue;
  }

  constructor() {
    super();
    // this.options = ['Green', 'Red', 'Brown', 'Black', 'White', 'Maroon', 'Yellow', 'Blue'];
  }

  ngAfterViewInit() {
    this.setCellInputHeight();
  }

  setCellInputHeight() {
    if (this.cellInput) {
      const el = this.cellInput.nativeElement;
      if (el && el.scrollHeight > el.offsetHeight) {
        const height = el.scrollHeight;
        el.style.setProperty('height', height + 'px');
      }
    }
  }

  isValueChanged(): boolean {
    if (this.value !== this.record[this.column.name]) {
      return super.isValueChanged();
    }
  }

  valueChanged(event, option) {
    if (option) {
      this.value = option.value;
      this.displayValue = option.label;
      // this.isValueChanged();
      this.saveCellValue();
    }
  }
}
