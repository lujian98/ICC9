import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IccCellEditComponent } from '../cell-edit.component';
import { IccSelectField } from '../../../../items';

@Component({
  selector: 'icc-cell-edit-select',
  templateUrl: './cell-edit-select.component.html',
})
export class IccCellEditSelectComponent<T> extends IccCellEditComponent<T> {
  column: IccSelectField<T>;
  private trackMouseLeave: () => void;
  saveDebounceTime = 300;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    super();
  }

  onOpenedChange(opened: boolean, select) {
    if (this.trackMouseLeave) {
      this.trackMouseLeave();
    }
    if (opened) {
      this.trackMouseLeave = this.renderer.listen(select.panel.nativeElement, 'mouseleave', () => {
        this.trackMouseLeave();
        select.close();
      });
    }
  }

  selectionChange(value: any) {
    if (this.column.multiSelect && value.length > 0 && !value[0]) {
      value = [];
    }
    this.isChangeSaved = false;
    this.value = value;
    this.isValidChange(value);
    this.valueChanged$.next(value);
  }

  isValueChanged(): boolean { // TODO multiSelect comparsion
    if (!this.message) {
      if (this.column.multiSelect) {
        const recordValue = this.column.getCheckedValue(this.record[this.column.name]);
        // const recordValue = this.checkSelectedValue(this.record[this.column.field]);
        return JSON.stringify(this.value) !== JSON.stringify(recordValue);
      } else {
        return this.value !== this.record[this.column.name];
      }
    }
  }

  resetValue(event) {
    super.resetValue(event);
    this.value = this.column.getCheckedValue(this.value);
  }
}
