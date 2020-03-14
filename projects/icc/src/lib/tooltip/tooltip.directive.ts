import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, share, startWith, switchMap, switchMapTo, takeUntil } from 'rxjs/operators';
import { IccOverlayComponentContent } from './overlay-component-ref';
import { IccTooltipService } from './tooltip.service';

@Directive({
  selector: '[iccTooltip]'
})
export class IccTooltipDirective<T> implements OnInit, OnDestroy {
  @Input('iccTooltip') content: IccOverlayComponentContent<T>;
  @Input() data: T;
  @Input() width: string | number = 200;
  @Input() height: string | number;

  overlayRef: OverlayRef;
  isOpened = false;
  destroy$ = new Subject<T>();

  constructor(
    private tooltipService: IccTooltipService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    const open$ = fromEvent(this.elementRef.nativeElement, 'mouseenter')
      .pipe(
        filter(() => !this.isOpened),
        switchMap(enterEvent =>
          fromEvent(document, 'mousemove')
            .pipe(
              startWith(enterEvent),
              debounceTime(300),
              filter(event => this.elementRef.nativeElement === event['target'])
            )
        ),
        share()
      );
    open$.pipe(takeUntil(this.destroy$)).subscribe(() => this.openDialog());
    const close$ = fromEvent(document, 'mousemove')
      .pipe(
        debounceTime(100),
        filter(() => this.isOpened),
        filter(event => this.isMovedOutside(event))
      );
    open$.pipe(takeUntil(this.destroy$), switchMapTo(close$)).subscribe(() => this.closeDialog());
  }

  private openDialog() {
    this.isOpened = true;
    this.overlayRef = this.tooltipService.open({
      origin: this.elementRef.nativeElement,
      content: this.content,
      data: this.data,
      width: this.width,
      height: this.height
    });
  }

  private closeDialog() {
    this.isOpened = false;
    this.overlayRef.detach();
  }

  private isMovedOutside(event): boolean {
    return !(this.elementRef.nativeElement.contains(event['target']) ||
      (this.overlayRef && this.overlayRef.overlayElement && this.overlayRef.overlayElement.contains(event['target'])));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
