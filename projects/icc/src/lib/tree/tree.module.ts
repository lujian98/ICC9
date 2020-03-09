import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { IccVirtualScrollModule } from '../directives/virtual-scroll/virtual-scroll.module';

import { IccTreeComponent } from './tree.component';
import { IccTreeViewDirective } from './tree-view.directive';
import { IccTreeHeaderComponent } from './tree-header/tree-header.component';
import { IccBaseTreeComponent } from './base-tree.component';
import { IccNestedTreeComponent } from './nested-tree/nested-tree.component';
import { IccFlatTreeComponent } from './flat-tree/flat-tree.component';

@NgModule({
  declarations: [
    IccTreeComponent,
    IccTreeViewDirective,
    IccTreeHeaderComponent,
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
    IccTreeComponent,
    IccTreeViewDirective,
    IccTreeHeaderComponent,
    IccBaseTreeComponent,
    IccNestedTreeComponent,
    IccFlatTreeComponent
  ],
  entryComponents: [
    IccTreeComponent,
    IccTreeHeaderComponent,
    IccBaseTreeComponent,
    IccNestedTreeComponent,
    IccFlatTreeComponent
  ]
})
export class IccTreeModule { }

