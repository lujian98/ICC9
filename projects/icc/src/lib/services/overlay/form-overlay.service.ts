import { Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { Component, Injectable, Injector } from '@angular/core';
import { IccOverlayService } from './overlay.service';
import { IccCellMenuFormComponent } from '../../grid';


@Injectable()
export class IccFormOverlayService extends IccOverlayService {
  componentMapper: {} = {};

  constructor(overlay: Overlay, injector: Injector) {
    super(overlay, injector);
    Object.assign(this.componentMapper,
      { cellMenuForm: IccCellMenuFormComponent });
  }

  getPortalComponent(portal: string): Component {
    return this.componentMapper[portal];
  }


  getPositionStrategy(origin: HTMLElement): PositionStrategy {
    return this.overlay.position()
    .global()
    .centerHorizontally()
    .centerVertically();
  }
}

