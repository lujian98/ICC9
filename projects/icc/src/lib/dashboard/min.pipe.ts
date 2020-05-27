import { Pipe, PipeTransform } from '@angular/core'; // TODO used this with

@Pipe({ name: 'min' })
export class MinPipe implements PipeTransform {
  public transform(value: any, ...args: any[]): number {
    // Take 'value' as fallback for undefined & 0
    const max: number = Number(String(args.shift() || 0)) || value;
    const min: number = Math.min(value, max);
    return args.length ? this.transform(min, ...args) : min;
  }
}

/*
  <mat-grid-list cdkDropListGroup
  [cols]="cols | min:responsiveColumns"
  [rowHeight]="rowHeight"
  [gutterSize]="gutterSize">
  <mat-grid-tile *ngFor="let tile of tiles; let dataIndex = index;"
    [colspan]="tile.cols | min:responsiveColumns:cols"
    [rowspan]="tile.rows | min:maxRows">
    <cdk-drop-list [cdkDropListData]="dataIndex" cdkDragHandle>
      <div class="icc-grid-tile" [style.backgroundColor]="tile.color"
        cdkDrag (cdkDragEntered)="entered($event)"
        (cdkDragDropped)="dropped($event)"
        [cdkDragData]="dataIndex">
        <span>{{ tile.title || tile.name }}</span>
      </div>
    </cdk-drop-list>
  </mat-grid-tile>
</mat-grid-list>

   updateCols(val: any): void {
     this.cols = this.toInt(val, 3) || 3;
   }

   updateCardMaxRows(val: any): void {
     this.maxRows = this.toInt(val, 2) || 2;
   }

   private toInt(val: any, fallbackValue: number = 0): number {
     const normalized = String(val).replace(/[\D]/g, '');
     const v = Number(normalized);
     return isNaN(v) ? fallbackValue : v;
   }
*/
