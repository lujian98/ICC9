import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccDashboardModule } from 'icc';

import { DocDashboardComponent } from './dashboard.component';
import { DocDashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DocDashboardComponent,
  ],
  imports: [
    CommonModule,
    IccDashboardModule,
    DocDashboardRoutingModule,
  ],
  exports: [
    DocDashboardComponent
  ]
})
export class DocDashboardModule { }
