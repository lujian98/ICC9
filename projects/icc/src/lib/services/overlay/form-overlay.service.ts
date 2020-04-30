import { Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { Component, Injectable, Injector } from '@angular/core';
import { IccOverlayService } from './overlay.service';
// import { IccCellMenuFormComponent } from '../../grid';


@Injectable() // TODO this will not needed any more
export class IccFormOverlayService<T> extends IccOverlayService<T> {
  componentMapper: {} = {};

  constructor(overlay: Overlay, injector: Injector) {
    super(overlay, injector);
    // Object.assign(this.componentMapper,
    //   { cellMenuForm: IccCellMenuFormComponent });
  }

  getPortalComponent(portal: string): Component {
    return this.componentMapper[portal];
  }

/*
  getPositionStrategy(origin: HTMLElement): PositionStrategy {
    return this.overlay.position()
    .global()
    .centerHorizontally()
    .centerVertically();
  } */
}

