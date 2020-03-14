import { ConnectionPositionPair, Overlay } from '@angular/cdk/overlay';
import { Component, Injectable, Injector } from '@angular/core';
import { IccOverlayService } from '../services/overlay/overlay.service';
import { IccTooltipComponent } from './tooltip/tooltip.component';

@Injectable({
  providedIn: 'root'
})
export class IccTooltipOverlayService extends IccOverlayService {

  componentMapper = {
    tooltip: IccTooltipComponent,
  };

  constructor(
    protected overlay: Overlay,
    protected injector: Injector
  ) {
    super(overlay, injector);
  }

  getPortalComponent(portal: string): Component {
    return this.componentMapper[portal];
  }

  getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom'
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      },
    ];
  }
}

