import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { IccOverlayComponentCloseEvent, IccOverlayComponentContent } from './overlay.model';

export class IccOverlayComponentRef<T> {
  private afterClosed = new Subject<IccOverlayComponentCloseEvent<T>>();
  afterClosed$ = this.afterClosed.asObservable();

  constructor(
    public overlay: OverlayRef,
    public componentContent: IccOverlayComponentContent<T>,
    public componentContext: {}

  ) {
    this.overlay.backdropClick().subscribe(() => this._close({ type: 'backdropClick', context: null }));
  }

  close(data?: T) {
    this._close({ type: 'close', context: data });
  }

  private _close(event: IccOverlayComponentCloseEvent) {
    this.overlay.dispose();
    this.afterClosed.next(event);
    this.afterClosed.complete();
  }
}

