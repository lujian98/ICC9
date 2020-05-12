import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccPanelModule } from 'icc';
import { IccDashboardModule } from 'icc';

import { DocDashboardComponent } from './dashboard.component';
import { DocDashboardDemo1Component } from './dashboards/dashboard-demo1.component';
import { DocDashboardRoutingModule } from './dashboard-routing.module';
import { PortalDemoComponent } from './portal-demo/portal-demo.component';
import { PortalDemo2Component } from './portal-demo2/portal-demo2.component';

@NgModule({
  imports: [
    CommonModule,
    IccPanelModule,
    IccDashboardModule,
    DocDashboardRoutingModule,
  ],
  declarations: [
    DocDashboardComponent,
    DocDashboardDemo1Component,
    PortalDemoComponent,
    PortalDemo2Component
  ],
  exports: [
    DocDashboardComponent,
    DocDashboardDemo1Component,
    PortalDemoComponent,
    PortalDemo2Component
  ]
})
export class DocDashboardModule { }
