import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IccOverlayComponentRef } from './overlay-component-ref';
import { IccOverlayConfig, DEFAULT_CONFIG } from './overlay.model';
import { IccPortalContent } from '../../portal/model';

@Injectable({
  providedIn: 'root'
})
export class IccOverlayService<T> {
  overlayComponentRef: IccOverlayComponentRef<T>;
  protected overlayRef: OverlayRef;
  constructor(protected overlay: Overlay, protected injector: Injector) { }

  open<G>(
    origin: HTMLElement,
    component: Type<G>,
    config: IccOverlayConfig = {},
    componentContent: IccPortalContent<T> = '',
    componentContext: {} = {}
  ): OverlayRef {
    config = { ...DEFAULT_CONFIG, ...config };
    const overlayConfig = this.getOverlayConfig(config, origin);
    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayComponentRef = new IccOverlayComponentRef<T>(this.overlayRef, componentContent, componentContext);
    const componentInjector = this.createInjector(this.overlayComponentRef);
    const componentPortal = new ComponentPortal(component, null, componentInjector);
    const containerRef = this.overlayRef.attach(componentPortal);
    Object.assign(containerRef.instance, {
      content: componentContent,
      context: componentContext,
      overlayComponentRef: this.overlayComponentRef
    });
    this.overlayRef
      .backdropClick()
      .pipe(takeWhile(() => config.shouldCloseOnBackdropClick))
      .subscribe(() => this.overlayRef.dispose());
    return this.overlayRef;
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

  private createInjector(overlayComponentRef: IccOverlayComponentRef<T>) {
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

  destroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}

