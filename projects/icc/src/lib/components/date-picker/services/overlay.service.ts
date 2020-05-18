import { Injectable, ComponentRef, ElementRef, Injector, InjectionToken, Type } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { takeWhile } from 'rxjs/operators';

import { IccOverlayConfig } from '../../../services/overlay/overlay.model';

const DEFAULT_CONFIG: IccOverlayConfig = {
  panelClass: 'icc-overlay',
  hasBackdrop: true,
  backdropClass: 'icc-overlay-backdrop',
  shouldCloseOnBackdropClick: true
};

@Injectable()
export class IccBaseOverlayService {
  private hostElemRef: ElementRef;
  componentRef: any;

  constructor(protected overlay: Overlay, private injector: Injector) { }


  /*
      origin: HTMLElement,
    component: Type<G>,
    config: IccOverlayConfig = {},
    componentContent: IccPortalContent<T> = '',
    componentContext: {} = {}

    */
  open<G>(
    config: IccOverlayConfig = {},
    hostElemRef: ElementRef,
    component?: Type<G>,
    configData?: {}
  ): OverlayRef {
    this.hostElemRef = hostElemRef;
    const overlayConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(overlayConfig);
    const portalInjector = this.createInjector(overlayRef);

    const componentPortal = new ComponentPortal(
      component,
      null,
      portalInjector
    );
    this.componentRef = overlayRef.attach(componentPortal);
    this.componentRef.instance.hostElemRef = hostElemRef;
    this.componentRef.instance.overlayRefParent = overlayRef;
    this.createComponentInstance(configData);

    overlayRef
      .backdropClick()
      .pipe(takeWhile(() => overlayConfig.shouldCloseOnBackdropClick))
      .subscribe(() => overlayRef.dispose());

    return overlayRef;
  }

  createComponentInstance(configData: {}) {
    this.componentRef.instance.overlayConfigData = configData;
  }

  private createOverlay(config: IccOverlayConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: IccOverlayConfig): OverlayConfig {
    const positionStrategy = this.getPositionStrategy();
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
    return overlayConfig;
  }

  getPositionStrategy(): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.hostElemRef)
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withDefaultOffsetY(10)
      .withPositions([
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
      ]);
  }

  private createInjector(overlayRef: OverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OverlayRef, overlayRef);
    return new PortalInjector(this.injector, injectionTokens);
  }
}

