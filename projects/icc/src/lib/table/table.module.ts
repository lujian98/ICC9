import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkTableModule } from '@angular/cdk/table';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { IccVirtualScrollModule } from '../directives/virtual-scroll/virtual-scroll.module';
import { IccDataSourceService } from '../services/data-source.service';

import { IccPanelModule } from '../components/panel/panel.module';

import { IccFieldViewModule } from '../directives/field-view/field-view.module';
import { IccFieldViewService } from '../directives/field-view/field-view.service';

import { IccMenuModule } from '../components/menu/menu.module';
import { IccTreeModule } from '../tree/tree.module';

import { IccTableComponent } from './table.component';
import { IccTableViewDirective } from './table-view.directive';
import { IccTableTopbarComponent } from './table-topbar/table-topbar.component';
import { IccTableHeaderComponent } from './table-header/table-header.component';
import { IccTableViewComponent } from './table-view/table-view.component';

import { IccTableEventService } from './services/table-event.service';


@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    ScrollingModule,
    CdkTreeModule,
    CdkTableModule,
    MatProgressBarModule,
    IccVirtualScrollModule,
    IccPanelModule,
    IccMenuModule,
    IccTreeModule,
    IccFieldViewModule
  ],
  declarations: [
    IccTableComponent,
    IccTableViewDirective,
    IccTableTopbarComponent,
    IccTableHeaderComponent,
    IccTableViewComponent
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
    IccTableEventService,
    IccFieldViewService
  ]
})
export class IccTableModule { }

