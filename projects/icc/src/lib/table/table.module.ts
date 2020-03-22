import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';

import { CdkTableModule } from '@angular/cdk/table';

import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { IccVirtualScrollModule } from '../directives/virtual-scroll/virtual-scroll.module';
import { IccDataSourceService } from '../services/data-source.service';

import { IccTreeModule } from '../tree/tree.module';

import { IccTableComponent } from './table.component';
import { IccTableViewDirective } from './table-view.directive';
import { IccTableHeaderComponent } from './table-header/table-header.component';
import { IccTableViewComponent } from './table-view/table-view.component';

@NgModule({
  declarations: [
    IccTableComponent,
    IccTableViewDirective,
    IccTableHeaderComponent,
    IccTableViewComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ScrollingModule,
    CdkTreeModule,
    CdkTableModule,
    MatIconModule,
    MatDividerModule,
    MatSortModule,
    MatTableModule,
    MatProgressBarModule,

    IccVirtualScrollModule,
    IccTreeModule
  ],
  exports: [
    IccTableComponent,
    IccTableViewDirective,
    IccTableHeaderComponent,
    IccTableViewComponent
  ],
  entryComponents: [
    IccTableComponent,
    IccTableHeaderComponent,
    IccTableViewComponent
  ],
  providers: [
    IccDataSourceService,
  ]
})
export class IccTableModule { }

