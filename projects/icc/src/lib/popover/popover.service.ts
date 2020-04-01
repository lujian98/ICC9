import { Injectable } from '@angular/core';
import { IccOverlayService } from '../services/overlay/overlay.service';

@Injectable({
  providedIn: 'root'
})
export class IccPopoverService extends IccOverlayService {

  /*
  getPositions(): ConnectionPositionPair[] {
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
  } */
}

