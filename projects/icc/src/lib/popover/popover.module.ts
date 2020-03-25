import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { IccPopoverDirective } from './popover.directive';
import { IccPopoverComponent } from './popover/popover.component';
import { IccOverlayContainerComponent } from './overlay-container.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule
  ],
  declarations: [
    IccPopoverDirective,
    IccPopoverComponent,
    IccOverlayContainerComponent
  ],
  entryComponents: [
    IccPopoverComponent,
    IccOverlayContainerComponent
  ],
  exports: [
    IccPopoverDirective,
    IccOverlayContainerComponent
  ],
  providers: [],
})
export class IccPopoverModule { }
