import { OverlayRef } from '@angular/cdk/overlay';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, filter, startWith, switchMap, takeWhile } from 'rxjs/operators';

export interface IccPopoverStrategy {
  show$: Observable<never | Event>;
  hide$: Observable<never | Event>;
  isOpened: boolean;
  overlayRef: OverlayRef;
  destroy();
}

export abstract class IccBasePopoverStrategy implements IccPopoverStrategy {
  protected alive = true;
  isOpened: boolean;
  overlayRef: OverlayRef;
  abstract show$: Observable<Event>;
  abstract hide$: Observable<Event>;
  constructor(
    protected document: Document,
    protected host: HTMLElement,
  ) { }

  destroy() {
    this.alive = false;
  }
}

export class IccPopoverHoverStrategy extends IccBasePopoverStrategy {
  show$ = fromEvent(this.host, 'mouseenter')
    .pipe(
      filter(() => !this.isOpened),
      switchMap(enterEvent =>
        fromEvent(document, 'mousemove')
          .pipe(
            startWith(enterEvent),
            debounceTime(100),
            filter(event => this.host.contains(event.target as Node))
          )
      ),
      takeWhile(() => this.alive)
    );
  hide$ = fromEvent(document, 'mousemove')
    .pipe(
      debounceTime(100),
      filter(() => this.isOpened),
      filter(event => this.isMovedOutside(event)),
      takeWhile(() => this.alive)
    );

  private isMovedOutside(event): boolean {
    return !(this.host.contains(event.target as Node) ||
      (this.overlayRef && this.overlayRef.overlayElement && this.overlayRef.overlayElement.contains(event.target as Node)));
  }
}

