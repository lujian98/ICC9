import { Component, ViewChild } from '@angular/core';
import { IccCellEditComponent } from '../cell-edit.component';
import { IccTextField } from '../../../../items';

@Component({
  selector: 'icc-cell-edit-text',
  templateUrl: './cell-edit-text.component.html',
})
export class IccCellEditTextComponent<T> extends IccCellEditComponent<T> {
  column: IccTextField;

  @ViewChild('cellInput') cellInput;

  constructor() {
    super();
  }

  isValueChanged(): boolean {
    if (this.value !== this.record[this.column.name]) {
      return super.isValueChanged();
    }
  }

  click(event) {
    event.stopPropagation();
  }

  focus(event) { // TODO issue if move key too fast, then the focus will be mess up with row index
    setTimeout(() => {
      event.target.select();
      // console.log( 'focust 6666=' + document.getSelection().toString() );
    }, 1); // delay will needed for left and right key, value 1 may not be enough
  }

  keydown(event) {
    this.cellEditSpecialKeyEvent(event.keyCode);
  }

  isFieldSelected(): boolean {
    if (typeof this.value === 'string') {
      return document.getSelection().toString() === this.value;
    }
  }

  isValidKeyEvent(keyCode: number): boolean {
    if (keyCode === 36 || keyCode === 37 || keyCode === 35 || keyCode === 39) {
      if (this.isFieldSelected()) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
