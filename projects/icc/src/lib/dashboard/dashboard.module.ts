import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IccPortalModule } from '../portal/portal.module';

import { IccDashboardComponent } from './dashboard.component';
import { IccResizeDirective } from './resize.directive';

@NgModule({
  declarations: [
    IccDashboardComponent,
    IccResizeDirective
  ],
  imports: [
    CommonModule,
    DragDropModule,
    IccPortalModule
  ],
  exports: [
    IccDashboardComponent,
    IccResizeDirective
  ]
})
export class IccDashboardModule { }
