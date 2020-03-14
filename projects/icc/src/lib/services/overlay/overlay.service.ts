import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IccOverlayConfig } from './overlay.model';
import { IccOverlayComponentContent, IccOverlayComponentRef } from './overlay-component-ref';

const DEFAULT_CONFIG: IccOverlayConfig = {
  panelClass: 'icc-overlay',
  hasBackdrop: true,
  backdropClass: 'icc-overlay-backdrop',
  shouldCloseOnBackdropClick: true
};


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
export abstract class IccOverlayService {
  private _overlayComponentRef: any;

  set overlayComponentRef(val: any) {
    this._overlayComponentRef = val;
  }

  get overlayComponentRef(): any {
    return this._overlayComponentRef;
  }

  // private hostElemRef: ElementRef;

  // componentRef: any; // TODO remove this???

  constructor(
    protected overlay: Overlay,
    protected injector: Injector
  ) { }

  abstract getPortalComponent(portal: string);

  open<T>(
    { origin, content, data, width, height }: IccOverlayParams<T>,
    portal: string,
    config: IccOverlayConfig = {},

    // hostElemRef?: any,
    // configData?: {}
  ): OverlayRef {

    // this.hostElemRef = hostElemRef;

    config = { ...DEFAULT_CONFIG, ...config };
    console.log( ' config =', config)
    const overlayConfig = this.getOverlayConfig(config, { origin, width, height });
    const overlayRef = this.overlay.create(overlayConfig);

    this.overlayComponentRef = new IccOverlayComponentRef<T>(overlayRef, content, data);
    const componentInjector = this.createInjector(this.overlayComponentRef);
    const component = this.getPortalComponent(portal);
    const componentPortal = new ComponentPortal(component, null, componentInjector);
    overlayRef.attach(componentPortal);
    // this.componentRef = overlayRef.attach(componentPortal);
    // this.componentRef.instance.hostElemRef = hostElemRef;
    // this.componentRef.instance.overlayRefParent = overlayRef;
    // this.createComponentInstance(configData);

    overlayRef
      .backdropClick()
      .pipe(takeWhile(() => config.shouldCloseOnBackdropClick))
      .subscribe(() => overlayRef.dispose());

    return overlayRef;
  }

  private getOverlayConfig(config: IccOverlayConfig, { origin, width, height }): OverlayConfig {
    const positionStrategy = this.getPositionStrategy(origin);
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      width,
      height,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // scrollStrategy: this.overlay.scrollStrategies.block(), //TODO
      positionStrategy
    });
    return overlayConfig;
  }

  // createComponentInstance(configData: {}) {
  //  this.componentRef.instance.overlayConfigData = configData;
  // }

  getPositionStrategy(origin: HTMLElement): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
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

  private createInjector(overlayComponentRef: IccOverlayComponentRef) {
    const injectionTokens = new WeakMap([[IccOverlayComponentRef, overlayComponentRef]]);
    // injectionTokens.set(OverlayRef, overlayRef);
    return new PortalInjector(this.injector, injectionTokens);
  }
  /*
  private createInjector(overlayRef: OverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OverlayRef, overlayRef);
    return new PortalInjector(this.injector, injectionTokens);
  } */
}


