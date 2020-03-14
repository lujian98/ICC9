import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccTableModule, IccTreeModule, IccTooltipModule } from 'icc';
import { TreeExampleComponent } from './tree-example.component';
import { TooltipDemoComponent } from '../../tooltip-demo/tooltip-demo.component';

@NgModule({
  declarations: [
    TreeExampleComponent,
    TooltipDemoComponent
  ],
  imports: [
    CommonModule,
    IccTableModule,
    IccTreeModule,
    IccTooltipModule
  ],
  exports: [
    TreeExampleComponent,
    TooltipDemoComponent
  ],
  entryComponents: [
    TooltipDemoComponent
  ],
  providers: [],
  bootstrap: []
})
export class TreeExampleModule { }
