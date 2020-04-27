import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccPanelComponent } from './panel.component';
import { IccPanelContentComponent } from './panel-content.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    IccPanelComponent,
    IccPanelContentComponent
  ],
  exports: [
    IccPanelComponent,
    IccPanelContentComponent
  ],
})
export class IccPanelModule { }
