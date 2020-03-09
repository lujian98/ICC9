import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IccGridConfigs } from '../../models';

@Component({
  selector: 'icc-tree-header',
  templateUrl: './tree-header.component.html',
  styleUrls: ['../tree.component.scss'],
})
export class IccTreeHeaderComponent implements OnChanges, AfterViewInit {
  @Input() columnConfigs: any[] = [];
  @Input() gridConfigs: IccGridConfigs;
  @Input() increaseWidth: boolean;
  @Input() descreaseWidth: boolean;

  tableWidth = 0;
  /*
  treeColumn: any;
  visibleColumns: any[] = [];
  displayedColumns: string[] = []; */

  ngAfterViewInit() {
    this.setTreeColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.increaseWidth && !changes.increaseWidth.firstChange) {
      this.columnConfigs[1].width += 10;
    } else if (changes.descreaseWidth && !changes.descreaseWidth.firstChange) {
      this.columnConfigs[1].width -= 10;
    }
    this.tableWidth = this.getTableSize();
  }

  protected getTableSize(): number {
    let width = 0;
    this.columnConfigs.forEach(column => {
      width += column.width;
    });
    return width;
  }

  protected setTreeColumns() {
    /*
    if (this.columnConfigs.length) {
      this.treeColumn = this.columnConfigs[0];
    } else {
      this.treeColumn = { width: 300 }; // TODO input tree column width
    }
    this.visibleColumns = this.columnConfigs;
    this.displayedColumns = this.visibleColumns.map(column => column.name); */
  }
}

