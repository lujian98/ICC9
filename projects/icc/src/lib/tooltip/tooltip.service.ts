import { ConnectionPositionPair, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { Component, Injectable, Injector } from '@angular/core';
import { IccOverlayService } from '../services/overlay/overlay.service';
import { IccTooltipComponent } from './tooltip/tooltip.component';

@Injectable({
  providedIn: 'root'
})
export class IccTooltipService extends IccOverlayService {

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

  getPositionStrategy(origin: HTMLElement): PositionStrategy {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions())
      .withFlexibleDimensions(false)
      .withPush(false);
    return positionStrategy;
  }

  private getPositions(): ConnectionPositionPair[] {
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
