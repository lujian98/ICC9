import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Directive,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
// import { IccBaseGridDataSource } from '../datasource/grid-datasource';
import { FixedSizeGridTableVirtualScrollStrategy } from './fixed-size-virtual-scroll.strategy';

export function getIccScrollStrategy(scroll: GridTableVirtualScrollDirective) {
  return scroll.scrollStrategy;
}

@Directive({
  selector: '[iccGridTableVirtualScroll]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useFactory: getIccScrollStrategy,
    deps: [forwardRef(() => GridTableVirtualScrollDirective)],
  }],
})
export class GridTableVirtualScrollDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() dataSourceLength = 0;
  @Input() rowHeight = 30;
  @Input() viewportBuffer = 5;
  @Input() minBufferPx = 300;
  @Input() maxBufferPx = 300;
  // @Input() dataSource: IccBaseGridDataSource<T>;

  // scrollStrategy: GridTableVirtualScrollStrategy;
  scrollStrategy: FixedSizeGridTableVirtualScrollStrategy;
  private sub: Subscription;
  protected readonly destroy$ = new Subject();

  constructor(
    public platform: Platform,
  ) {
    // this.scrollStrategy = new GridTableVirtualScrollStrategy(this.rowHeight);
    this.scrollStrategy = new FixedSizeGridTableVirtualScrollStrategy(
      this.rowHeight, this.minBufferPx, this.maxBufferPx);
  }

  ngAfterViewInit() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(10),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.scrollStrategy.checkViewportSize();
        this.setScrollStrategyViewPort();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.dataSource && changes.dataSource.currentValue) {
      // this.initialScrollStrategy();
    // }

    if (changes.dataSourceLength) {
      console.log(' changes.dataSourceLength= ', changes.dataSourceLength.currentValue);
      this.scrollStrategy.setDataLength(changes.dataSourceLength.currentValue);
    }

    if (changes.viewportBuffer && changes.viewportBuffer.currentValue) {
      this.scrollStrategy.viewportBuffer = changes.viewportBuffer.currentValue;
    }
    this.setScrollStrategyViewPort();
  }

  setScrollStrategyViewPort() {
    this.scrollStrategy.updateItemAndBufferSize(this.rowHeight, this.minBufferPx, this.maxBufferPx);
  }

//  initialScrollStrategy() {
//    this.sub = this.dataSource.queryData$.subscribe(data => {
//      console.log( ' data length =', data.length)
//      // this.scrollStrategy.setDataLength(data.length);
//    });
//  }

  scrollToPosition(top: number) {
    top = top > 0 ? top : 0;
    if (this.scrollStrategy.viewport) {
      this.scrollStrategy.viewport.elementRef.nativeElement.scrollTop = top;
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('wheel', ['$event'])
  onMousewheel(event: WheelEvent) { // different browser test
    if (event.deltaY !== 0) {
      let currentOffset = this.scrollStrategy.currentOffset;
      event.preventDefault();
      let deltaY = event.deltaY;
      // stabelize mouse wheel move up to avoid scroll bar up and down
      if (this.platform.FIREFOX) {
        deltaY *= 10;
      } else if (this.platform.EDGE) {
        deltaY /= 4;
      } else if (this.platform.BLINK || this.platform.SAFARI) {
        deltaY /= 2;
      }
      currentOffset += deltaY;
      currentOffset = currentOffset > 0 ? currentOffset : 0;
      currentOffset = currentOffset < this.scrollStrategy.contentSize ? currentOffset : this.scrollStrategy.contentSize;
      const skip = Math.round(currentOffset / this.rowHeight);
      const index = Math.max(0, skip);
      const start = Math.max(0, index);
      this.scrollStrategy.currentOffset = currentOffset;
      this.scrollStrategy.isMouseWheelUp = event.deltaY <= 0 ? true : false;
      this.scrollToPosition(this.rowHeight * start);
    }
  }
}

