import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IccOverlayComponentRef } from './overlay-component-ref';
import { IccOverlayConfig, IccOverlayContent } from './overlay.model';

const DEFAULT_CONFIG: IccOverlayConfig = {
  panelClass: 'icc-overlay',
  hasBackdrop: true,
  backdropClass: 'icc-overlay-backdrop',
  shouldCloseOnBackdropClick: true
};

@Injectable({
  providedIn: 'root'
})
export abstract class IccOverlayService {
  private _overlayComponentRef: any;

  set overlayComponentRef(val: any) {
    this._overlayComponentRef = val;
  }

  get overlayComponentRef(): any {
    return this._overlayComponentRef;
  }

  constructor(
    protected overlay: Overlay,
    protected injector: Injector
  ) { }

  abstract getPortalComponent(portal: string);

  open<T>(
    origin: HTMLElement,
    portal: string,
    overlayContent: IccOverlayContent<T> = {},
    config: IccOverlayConfig = {}
  ): OverlayRef {
    config = { ...DEFAULT_CONFIG, ...config };
    const overlayConfig = this.getOverlayConfig(config, origin);
    const overlayRef = this.overlay.create(overlayConfig);
    this.overlayComponentRef = new IccOverlayComponentRef<T>(overlayRef, overlayContent);
    const componentInjector = this.createInjector(this.overlayComponentRef);
    const component = this.getPortalComponent(portal);
    const componentPortal = new ComponentPortal(component, null, componentInjector);
    overlayRef.attach(componentPortal);
    overlayRef
      .backdropClick()
      .pipe(takeWhile(() => config.shouldCloseOnBackdropClick))
      .subscribe(() => overlayRef.dispose());
    return overlayRef;
  }

  private getOverlayConfig(config: IccOverlayConfig, origin: HTMLElement): OverlayConfig {
    const positionStrategy = this.getPositionStrategy(origin);
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      width: config.width,
      height: config.height,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // scrollStrategy: this.overlay.scrollStrategies.block(), //TODO
      positionStrategy
    });
    return overlayConfig;
  }

  private createInjector(overlayComponentRef: IccOverlayComponentRef) {
    const injectionTokens = new WeakMap();
    injectionTokens.set(IccOverlayComponentRef, overlayComponentRef);
    return new PortalInjector(this.injector, injectionTokens);
  }

  getPositionStrategy(origin: HTMLElement): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions())
      .withFlexibleDimensions(false)
      .withPush(false);
    // .withViewportMargin(8)
    // .withDefaultOffsetY(10)
  }

  getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom'
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top'
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom'
      }
    ];
  }
}

