import { Component } from '@angular/core';
import { IccColumnFilterComponent } from '../column-filter.component';
import { IccTextField } from '../../../../items';

@Component({
  selector: 'icc-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss']
})
export class IccTextFilterComponent<T> extends IccColumnFilterComponent<T> {
  column: IccTextField;

  constructor() {
    super();
  }
}
