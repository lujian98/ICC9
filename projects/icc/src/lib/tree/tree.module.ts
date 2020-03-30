import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { IccVirtualScrollModule } from '../directives/virtual-scroll/virtual-scroll.module';

import { IccBaseTreeComponent } from './base-tree.component';
import { IccNestedTreeComponent } from './nested-tree/nested-tree.component';
import { IccFlatTreeComponent } from './flat-tree/flat-tree.component';

import { IccTableEventService } from '../table/services/table-event.service';

@NgModule({
  declarations: [
    IccBaseTreeComponent,
    IccNestedTreeComponent,
    IccFlatTreeComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ScrollingModule,
    CdkTreeModule,
    MatIconModule,
    IccVirtualScrollModule
  ],
  exports: [
    IccBaseTreeComponent,
    IccNestedTreeComponent,
    IccFlatTreeComponent
  ],
  entryComponents: [
    IccBaseTreeComponent,
    IccNestedTreeComponent,
    IccFlatTreeComponent
  ],
  providers: [
    IccTableEventService
  ]
})
export class IccTreeModule { }

