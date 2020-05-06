import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccPanelModule } from 'icc';
import { LayoutsComponent } from './layouts.component';
import { PanelExampleModule } from '../panel/panel-example.module';

import { LayoutsRoutingModule } from './layouts-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IccPanelModule,
    PanelExampleModule,
    LayoutsRoutingModule
  ],
  declarations: [
    LayoutsComponent,

  ],
  entryComponents: [
    LayoutsComponent,
  ],
})
export class LayoutsModule { }
