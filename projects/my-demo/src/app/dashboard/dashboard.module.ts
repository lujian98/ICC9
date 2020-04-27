import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccPanelModule } from 'icc';
import { IccDashboardModule } from 'icc';

import { DocDashboardComponent } from './dashboard.component';
import { DocDashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IccPanelModule,
    IccDashboardModule,
    DocDashboardRoutingModule,
  ],
  declarations: [
    DocDashboardComponent,
  ],
  exports: [
    DocDashboardComponent
  ]
})
export class DocDashboardModule { }
