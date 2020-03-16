import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { IccOverlayComponentCloseEvent, IccOverlayContent } from './overlay.model';

export class IccOverlayComponentRef<T = any> {
  private afterClosed = new Subject<IccOverlayComponentCloseEvent<T>>();
  afterClosed$ = this.afterClosed.asObservable();

  constructor(
    public overlay: OverlayRef,
    public overlayContent: IccOverlayContent<T>,
  ) {
    this.overlay.backdropClick().subscribe(() => this._close({ type: 'backdropClick', data: null }));
  }

  close(data?: T) {
    this._close({ type: 'close', data: data });
  }

  private _close(event: IccOverlayComponentCloseEvent) {
    this.overlay.dispose();
    this.afterClosed.next(event);
    this.afterClosed.complete();
  }
}

