import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { IccTooltipDirective } from './tooltip.directive';
import { IccTooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  declarations: [
    IccTooltipDirective,
    IccTooltipComponent,
  ],
  entryComponents: [
    IccTooltipComponent
  ],
  exports: [
    IccTooltipDirective,
  ],
  providers: [],
})
export class IccTooltipModule { }
