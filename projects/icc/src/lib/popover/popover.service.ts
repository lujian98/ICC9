import { Injectable } from '@angular/core';
import { IccOverlayService } from '../services/overlay/overlay.service';

@Injectable({ // TODO may not need and only use IccOverlayService ???
  providedIn: 'root'
})
export class IccPopoverService<T> extends IccOverlayService<T> {

}

