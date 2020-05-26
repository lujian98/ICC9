import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatIconModule} from '@angular/material/icon';
import { CdkTreeModule } from '@angular/cdk/tree';

import { IccTableModule, IccTreeModule, IccPopoverModule, IccToolbarModule } from 'icc';
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
    IccPopoverModule,
    IccToolbarModule,
    MatIconModule,
    CdkTreeModule
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
