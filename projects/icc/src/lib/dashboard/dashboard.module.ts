import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IccPortalModule } from '../components/portal/portal.module';
import { IccMenuModule } from '../components/menu/menu.module';
import { IccResizeModule } from '../directives/resize/resize.module';

import { IccDashboardComponent } from './dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    IccPortalModule,
    IccMenuModule,
    IccResizeModule
  ],
  declarations: [
    IccDashboardComponent,
  ],
  exports: [
    IccDashboardComponent,
  ]
})
export class IccDashboardModule { }
