import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { switchMap, debounceTime, filter, takeUntil, takeWhile, delay, repeat } from 'rxjs/operators';

import { IccOverlayComponentContent, IccOverlayConfig } from '../services/overlay/overlay.model';
import { IccPopoverService } from './popover.service';
import { IccBasePopoverStrategy, IccPopoverHoverStrategy } from './popover.strategy';
import { IccPopoverComponent } from './popover/popover.component';

@Directive({
  selector: '[iccPopover]'
})
export class IccPopoverDirective<T> implements OnInit, OnDestroy {
  @Input('iccPopover') content: IccOverlayComponentContent<T>;
  @Input('iccPopoverContext') context = {};
  @Input() width: string | number = 200;
  @Input() height: string | number;
  @Input() disabled = false;

  private popoverStrategy: IccBasePopoverStrategy;
  private overlayRef: OverlayRef;
  private overlayConfig: IccOverlayConfig = {
    panelClass: '',
    backdropClass: 'popover-backdrop',
  };
  private isOpened = false;

  protected alive = true;

  show$: Observable<Event>;
  hide$: Observable<Event>;


  constructor(
    private overlayService: IccPopoverService,
    private elementRef: ElementRef,
    // protected document: Document,
  ) { }

  ngOnInit() {

    /*
    if (!this.disabled) {
      this.popoverStrategy = new IccPopoverHoverStrategy(document, this.elementRef.nativeElement);
      this.popoverStrategy.show$.subscribe(() => this.openPopover());
      this.popoverStrategy.hide$.subscribe(() => this.closePopover());
    } */

    this.show$ = fromEvent<Event>(this.elementRef.nativeElement, 'mouseenter').pipe(
      filter(() => !this.container()),
      delay(100),
      takeUntil(fromEvent<Event>(this.elementRef.nativeElement, 'mouseleave')),
      repeat(),
      takeWhile(() => this.alive)
    );

    this.hide$ = fromEvent<Event>(this.elementRef.nativeElement, 'mouseleave').pipe(
      switchMap(() =>
        fromEvent<Event>(document, 'mousemove').pipe(
          debounceTime(100),
          takeWhile(() => !!this.container()),
          filter(
            event =>
              !this.elementRef.nativeElement.contains(event.target as Node) &&
              !this.container().location.nativeElement.contains(event.target)
          )
        )
      ),
      takeWhile(() => this.alive)
    );

    this.show$.subscribe(() => this.openPopover());
    this.hide$.subscribe(() => this.closePopover());
  }

  private openPopover() {
    console.log( ' open popeee')
    this.isOpened = true;
    const overlayConfig: IccOverlayConfig = {
      width: this.width,
      height: this.height,
      ...this.overlayConfig
    };
    this.overlayRef = this.overlayService.open(
      this.elementRef.nativeElement,
      IccPopoverComponent,
      overlayConfig,
      this.content,
      this.context
    );
    // this.popoverStrategy.isOpened = this.isOpened;
    // this.popoverStrategy.overlayRef = this.overlayRef;
  }

  private closePopover() {
    this.isOpened = false;
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.overlayService.hide();
    // this.popoverStrategy.isOpened = this.isOpened;
    // this.popoverStrategy.overlayRef = null;
  }

  container() {
    return this.overlayService.container();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

