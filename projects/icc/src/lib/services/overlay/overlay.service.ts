import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy, GlobalPositionStrategy } from '@angular/cdk/overlay';
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
  containerRef: ComponentRef<{}>;
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
    this.containerRef = this.overlayRef.attach(componentPortal);
    Object.assign(this.containerRef.instance, {
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
    const positionStrategy = this.getPositionStrategy(config, origin);
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

  getPositionStrategy(config: IccOverlayConfig, origin: HTMLElement): PositionStrategy {
    const positions = this.getPositions(config.position);
    // TODO define the position from the config.position and offset.
    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
    // .withViewportMargin(8)
    // .withDefaultOffsetY(10)
  }

  getPositions(position: string): ConnectionPositionPair[] {
    const keys = ['bottomLeft', 'bottomRight', 'bottom'];
    let postions: ConnectionPositionPair[] = [
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetX: -5, offsetY: null }, // bottomLeft most popover
      { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetX: null, offsetY: -30 }, // bottomRight nested menu
      { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetX: null, offsetY: -30 }, // leftBottom
      { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetX: null, offsetY: null }, // bottom

      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetX: null, offsetY: null }, // topLeft
      { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetX: null, offsetY: null }, // Not sure this Bottom
      { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetX: null, offsetY: null },  // rightTop

    ];
    const index = keys.indexOf(position);
    if (index !== -1) {
      postions = postions.slice(index).concat(postions.slice(0, index));
    }
    return postions;
  }

  destroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}

