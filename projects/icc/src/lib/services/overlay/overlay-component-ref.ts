import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef, Type } from '@angular/core';
import { Subject } from 'rxjs';

export interface IccOverlayComponentCloseEvent<T = any> {
  type: 'backdropClick' | 'close';
  data: T;
}

export type IccOverlayComponentContent<T> = string | TemplateRef<T> | Type<T>;

export class IccOverlayComponentRef<T = any> {
  private afterClosed = new Subject<IccOverlayComponentCloseEvent<T>>();
  afterClosed$ = this.afterClosed.asObservable();

  constructor(
    public overlay: OverlayRef,
    public content: IccOverlayComponentContent<T>,
    public data: T
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

