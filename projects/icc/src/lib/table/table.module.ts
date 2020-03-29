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

import { IccMenuModule } from '../menu/menu.module';
import { IccTreeModule } from '../tree/tree.module';

import { IccTableComponent } from './table.component';
import { IccTableViewDirective } from './table-view.directive';
import { IccTableTopbarComponent } from './table-topbar/table-topbar.component';
import { IccTableHeaderComponent } from './table-header/table-header.component';
import { IccTableViewComponent } from './table-view/table-view.component';

import { IccColumnHeaderService } from './services/column-header.service';


@NgModule({
  declarations: [
    IccTableComponent,
    IccTableViewDirective,
    IccTableTopbarComponent,
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
    IccMenuModule,
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
    IccTableTopbarComponent,
    IccTableHeaderComponent,
    IccTableViewComponent
  ],
  providers: [
    IccDataSourceService,
    IccColumnHeaderService
  ]
})
export class IccTableModule { }

