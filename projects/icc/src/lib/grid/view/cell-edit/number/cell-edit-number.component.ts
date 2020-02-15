import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { IccNumberField } from '../../../../items';
import { IccCellEditComponent } from '../cell-edit.component';
// import { IccGridViewComponent } from '../../grid-view.component';

@Component({
  selector: 'icc-cell-edit-number',
  templateUrl: './cell-edit-number.component.html',
})
export class IccCellEditNumberComponent<T> extends IccCellEditComponent<T> implements OnInit {
  column: IccNumberField;
  @ViewChild('cellInput', { read: ElementRef }) cellInput: ElementRef;

  bgcolor = 'rgb(255, 255, 255)';

  // constructor(private gridView: IccGridViewComponent<T>,
  constructor() {
    super();
  }

  ngOnInit(): void {
    /*
    this.bgcolor = this.getBkColor();
    this.gridView.viewport.renderedRangeStream.pipe(map(() => { }))
      .subscribe(() => {
        setTimeout(() => {
          this.bgcolor = this.getBkColor();
        }, 5);
      }); */
    super.ngOnInit();
  }

  getBkColor() {
    /*
    const viewportRows = this.gridView.viewport.elementRef.nativeElement.getElementsByTagName('mat-row');
    const row = viewportRows[this.rowIndex];
    if (row) {
      const style = window.getComputedStyle(row);
      return style['background-color'];
    } */
  }

  isValueChanged(): boolean {
    if (Number(this.value) !== Number(this.record[this.column.name])) {
      return super.isValueChanged();
    }
  }

  click(event) {
    event.stopPropagation();
  }

  focus(event) {
    setTimeout(() => {
      event.target.select();
    }, 1);
  }

  keydown(event) { // up/down not working with number field
    const keyCode = event.keyCode;
    if (keyCode === 36 || keyCode === 37 || keyCode === 35 || keyCode === 39) {
      this.cellEditSpecialKeyEvent(event.keyCode);
    }
  }

  wheel(event) {
    event.stopPropagation();
  }

  isFieldSelected(): boolean {
    if (typeof this.value === 'number' || typeof this.value === 'string') {
      return Number(document.getSelection()) === Number(this.value);
    }
  }

  isValidKeyEvent(keyCode: number): boolean {
    if (this.isFieldSelected()) {
      return true;
    } else {
      return false;
    }
  }
}
