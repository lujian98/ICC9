import { NgModule } from '@angular/core';

import {
  IccPanelHeaderComponent,
  IccPanelContentComponent,
  IccPanelFooterComponent,
  IccPanelComponent
} from './panel.component';

@NgModule({
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
