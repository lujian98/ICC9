import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatIconModule} from '@angular/material/icon';
import { CdkTreeModule } from '@angular/cdk/tree';

import { IccTableModule, IccTreeModule, IccPopoverModule, IccPortalModule, IccToolbarModule, IccMenuModule} from 'icc';
import { TreeExampleComponent } from './tree-example.component';
import { TooltipDemoComponent } from '../../tooltip-demo/tooltip-demo.component';
import { IccPopoverService } from './popover.service';
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
    IccMenuModule,
    IccPortalModule,
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
  providers: [IccPopoverService],
  bootstrap: []
})
export class TreeExampleModule { }
