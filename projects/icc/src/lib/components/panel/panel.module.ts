import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccResizeModule } from '../../directives/resize/resize.module';

import {
  IccPanelHeaderComponent,
  IccPanelFooterComponent,
  IccPanelComponent
} from './panel.component';

import { IccPanelContentComponent } from './panel-content.component';


@NgModule({
  imports: [
    CommonModule,
    IccResizeModule,
  ],
  declarations: [
    IccPanelHeaderComponent,
    IccPanelContentComponent,
    IccPanelFooterComponent,
    IccPanelComponent
  ],
  exports: [
    IccPanelHeaderComponent,
    IccPanelContentComponent,
    IccPanelFooterComponent,
    IccPanelComponent
  ]
})
export class IccPanelModule {}
