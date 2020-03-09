import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IccGridConfigs } from '../models';

@Component({
  selector: 'icc-tree',
  templateUrl: './tree.component.html'
})
export class IccTreeComponent<T> implements OnChanges {
  @Input() treeType: string;
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

