import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IccGridConfigs } from '../models';

@Component({
  selector: 'icc-table',
  templateUrl: './table.component.html'
})
export class IccTableComponent<T> implements OnChanges {
  @Input() tableType: string;
  @Input() data: T[] = [];
  @Input() gridConfigs: IccGridConfigs = {
    columnHeaderPosition: 0
  };
  @Input() columnConfigs: any[] = [];
  expandAll: boolean;
  collapseAll: boolean;

  constructor(
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gridConfigs) {
      if (!this.gridConfigs.columnHeaderPosition) {
        this.gridConfigs.columnHeaderPosition = 0;
      }
    }
  }
}

