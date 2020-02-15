import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IccColumnFilterComponent } from '../column-filter.component';
import { IccSelectField } from '../../../../items';

@Component({
  selector: 'icc-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class IccSelectFilterComponent<T> extends IccColumnFilterComponent<T> {
  column: IccSelectField<T>;
  private trackMouseLeave: () => void;

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

  selectionChange(event, value: any) {
    if (this.column.filterMultiSelect && value.length > 0 && !value[0] ) {
      value = [];
    }
    this.value = value;
    this.filteredValues[this.column.name] = value;
    this.setDataFilters();
  }

  hasFilterValue(): boolean {
    if (this.value instanceof Array) {
      return this.value.length ? true : false;
    } else {
      return this.value ? true : false;
    }
  }
}
