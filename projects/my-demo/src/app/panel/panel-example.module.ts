import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccPanelModule } from 'icc';
import { PanelExampleComponent } from './panel-example.component';

@NgModule({
  imports: [
    CommonModule,
    IccPanelModule,
  ],
  declarations: [
    PanelExampleComponent
  ],
  exports: [
    PanelExampleComponent
  ],
  entryComponents: [
    PanelExampleComponent
  ]
})
export class PanelExampleModule { }
