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

  visibleColumns: IccField[] = [];
  displayedColumns: string[] = [];

  get tableWidth(): number {
    return this.visibleColumns.map(column => column.width).reduce((prev, curr) => prev + curr, 0);
  }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      this.setHeaderColumns();
    }
    if (changes.increaseWidth && !changes.increaseWidth.firstChange) {
      this.visibleColumns[1].width += 10;
    } else if (changes.descreaseWidth && !changes.descreaseWidth.firstChange) {
      this.visibleColumns[1].width -= 10;
    }
  }

  protected setHeaderColumns() {
    this.visibleColumns = this.columns;
    this.displayedColumns = this.visibleColumns.map(column => column.name);
  }
}

