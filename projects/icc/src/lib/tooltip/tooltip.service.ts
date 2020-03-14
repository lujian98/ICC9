import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { IccOverlayComponentContent, IccOverlayComponentRef } from '../services/overlay/overlay-component-ref';
import { IccTooltipComponent } from './tooltip/tooltip.component';

export interface IccOverlayParams<T> {
  origin: HTMLElement;
  content: IccOverlayComponentContent<T>;
  data?: T;
  width?: string | number;
  height?: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class IccTooltipService {
  private _overlayComponentRef: any;

  set overlayComponentRef(val: any) {
    this._overlayComponentRef = val;
  }

  get overlayComponentRef(): any {
    return this._overlayComponentRef;
  }

  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) { }

  open<T>({ origin, content, data, width, height }: IccOverlayParams<T>): OverlayRef {
    const overlayRef = this.overlay.create(this.getOverlayConfig({ origin, width, height }));
    this.overlayComponentRef = new IccOverlayComponentRef<T>(overlayRef, content, data);
    const injector = this.createInjector(this.overlayComponentRef, this.injector);
    overlayRef.attach(new ComponentPortal(IccTooltipComponent, null, injector));
    return overlayRef;
  }

  private getOverlayConfig({ origin, width, height }): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      width,
      height,
      backdropClass: 'tooltip-backdrop',
      positionStrategy: this.getOverlayPosition(origin),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private getOverlayPosition(origin: HTMLElement): PositionStrategy {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions())
      .withFlexibleDimensions(false)
      .withPush(false);
    return positionStrategy;
  }

  createInjector(tooltipRef: IccOverlayComponentRef, injector: Injector) {
    const tokens = new WeakMap([[IccOverlayComponentRef, tooltipRef]]);
    return new PortalInjector(injector, tokens);
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
