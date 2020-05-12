import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccPanelModule, IccResizeModule } from 'icc';

import { LayoutsComponent } from './layouts.component';
import { PanelExampleModule } from '../panel/panel-example.module';


import { LayoutsRoutingModule } from './layouts-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IccPanelModule,
    IccResizeModule,
    PanelExampleModule,
    LayoutsRoutingModule
  ],
  declarations: [
    LayoutsComponent,
    // SomeOtherComponent,
    // ExampleComponent
  ],
  entryComponents: [
    LayoutsComponent,
    // SomeOtherComponent,
    // ExampleComponent
  ],
})
export class LayoutsModule { }
