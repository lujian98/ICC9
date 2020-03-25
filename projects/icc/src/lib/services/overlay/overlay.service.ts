import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IccOverlayComponentRef } from './overlay-component-ref';
import { IccOverlayConfig, IccOverlayComponentContent, DEFAULT_CONFIG } from './overlay.model';
import { IccRenderableContainer } from '../../popover/overlay-container.component';


@Injectable({
  providedIn: 'root'
})
export class IccOverlayService {
  protected containerRef: ComponentRef<IccRenderableContainer>;
  constructor(protected overlay: Overlay, protected injector: Injector) { }

  open<T, C>(
    origin: HTMLElement,
    component: Type<IccRenderableContainer>,
    config: IccOverlayConfig = {},
    componentContent: IccOverlayComponentContent<T> = '',
    componentContext: {} = {}
  ): OverlayRef {
    config = { ...DEFAULT_CONFIG, ...config };
    const overlayConfig = this.getOverlayConfig(config, origin);
    const overlayRef = this.overlay.create(overlayConfig);
    const overlayComponentRef = new IccOverlayComponentRef<T>(overlayRef, componentContent, componentContext);
    const componentInjector = this.createInjector(overlayComponentRef);
    const componentPortal = new ComponentPortal(component, null, componentInjector);

    this.containerRef = overlayRef.attach(componentPortal);

    // this.updateContext();

    overlayRef
      .backdropClick()
      .pipe(takeWhile(() => config.shouldCloseOnBackdropClick))
      .subscribe(() => overlayRef.dispose());
    return overlayRef;
  }

  container() {
    return this.containerRef;
  }

  hide() {
    // this.overlayRef.detach();
    this.containerRef = null;
  }

  private updateContext() {
    /*
    Object.assign(this.containerRef.instance, {
      content: this.content,
      context: this.context,
      cfr: this.componentFactoryResolver
    }); */
    this.containerRef.instance.renderContent();
    this.containerRef.changeDetectorRef.detectChanges();
  }

  private getOverlayConfig(config: IccOverlayConfig, origin: HTMLElement): OverlayConfig {
    const positionStrategy = this.getPositionStrategy(origin);
    const overlayConfig = new OverlayConfig({
      // hasBackdrop: config.hasBackdrop,
      width: config.width,
      height: config.height,
      // backdropClass: config.backdropClass,
      // panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // scrollStrategy: this.overlay.scrollStrategies.block(), //TODO
      positionStrategy
    });
    return overlayConfig;
  }

  private createInjector<T>(overlayComponentRef: IccOverlayComponentRef<T>) {
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

