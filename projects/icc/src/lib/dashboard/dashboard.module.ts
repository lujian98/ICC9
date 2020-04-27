import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IccPortalModule } from '../portal/portal.module';
import { IccMenuModule } from '../menu/menu.module';

import { IccDashboardComponent } from './dashboard.component';
import { IccResizeDirective } from './resize.directive';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    IccPortalModule,
    IccMenuModule
  ],
  declarations: [
    IccDashboardComponent,
    IccResizeDirective
  ],
  exports: [
    IccDashboardComponent,
    IccResizeDirective
  ]
})
export class IccDashboardModule { }
