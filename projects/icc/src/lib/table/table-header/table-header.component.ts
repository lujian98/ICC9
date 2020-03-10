import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IccField } from '../../items';
import { IccTableConfigs } from '../../models';

@Component({
  selector: 'icc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class IccTableHeaderComponent implements OnChanges, AfterViewInit {
  @Input() columns: IccField[] = [];
  @Input() tableConfigs: IccTableConfigs;
  @Input() increaseWidth: boolean;
  @Input() descreaseWidth: boolean;

  tableWidth = 0;

  ngAfterViewInit() {
    this.setTreeColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.increaseWidth && !changes.increaseWidth.firstChange) {
      this.columns[1].width += 10;
    } else if (changes.descreaseWidth && !changes.descreaseWidth.firstChange) {
      this.columns[1].width -= 10;
    }
    this.tableWidth = this.getTableSize();
  }

  protected getTableSize(): number {
    let width = 0;
    this.columns.forEach(column => {
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

