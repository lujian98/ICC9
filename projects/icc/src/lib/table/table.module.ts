import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { IccVirtualScrollModule } from '../directives/virtual-scroll/virtual-scroll.module';

import { IccTreeModule } from '../tree/tree.module';

import { IccTableComponent } from './table.component';
import { IccTableViewDirective } from './table-view.directive';
import { IccTableHeaderComponent } from './table-header/table-header.component';

@NgModule({
  declarations: [
    IccTableComponent,
    IccTableViewDirective,
    IccTableHeaderComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ScrollingModule,
    CdkTreeModule,
    MatIconModule,
    IccVirtualScrollModule,
    IccTreeModule
  ],
  exports: [
    IccTableComponent,
    IccTableViewDirective,
    IccTableHeaderComponent
  ],
  entryComponents: [
    IccTableComponent,
    IccTableHeaderComponent
  ]
})
export class IccTableModule { }

