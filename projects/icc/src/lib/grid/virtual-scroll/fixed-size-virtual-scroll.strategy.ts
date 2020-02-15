import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class FixedSizeGridTableVirtualScrollStrategy implements VirtualScrollStrategy {
  scrolledIndexChange: Observable<number>;
  private previousIndex = -1;
  private readonly indexChange = new Subject<number>();
  viewport: CdkVirtualScrollViewport | null = null;
  private _itemHeight: number;
  private _minBufferPx: number;
  private _maxBufferPx: number;
  private _dataLength = 0;
  private _viewportBuffer = 5;
  private _currentOffset = 0;
  private _isMouseWheelUp: boolean;
  private _contentSize = 0;

  private sub: Subscription;

  set itemHeight(val: number) {
    this._itemHeight = val;
  }

  get itemHeight(): number {
    return this._itemHeight;
  }

  set minBufferPx(val: number) {
    this._minBufferPx = val;
  }

  get minBufferPx(): number {
    return this._minBufferPx;
  }

  set maxBufferPx(val: number) {
    this._maxBufferPx = val;
  }

  get maxBufferPx(): number {
    return this._maxBufferPx;
  }

  set dataLength(val: number) {
    this._dataLength = val;
  }

  get dataLength(): number {
    return this._dataLength;
  }

  set viewportBuffer(val: number) {
    this._viewportBuffer = val;
  }

  get viewportBuffer(): number {
    return this._viewportBuffer;
  }

  set currentOffset(val: number) {
    this._currentOffset = val;
  }

  get currentOffset(): number {
    return this._currentOffset;
  }

  set isMouseWheelUp(val: boolean) {
    this._isMouseWheelUp = val;
  }

  get isMouseWheelUp(): boolean {
    return this._isMouseWheelUp;
  }

  set contentSize(val: number) {
    this._contentSize = val;
  }

  get contentSize(): number {
    return this._contentSize;
  }

  constructor(itemHeight: number, minBufferPx: number, maxBufferPx: number) {
    if (maxBufferPx < minBufferPx) {
      maxBufferPx = minBufferPx;
    }
    this.itemHeight = itemHeight;
    this.minBufferPx = minBufferPx;
    this.maxBufferPx = maxBufferPx;
    this.scrolledIndexChange = this.indexChange.pipe(distinctUntilChanged());
  }

  attach(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
    this.updateTotalContentSize();
    this.updateRenderedRange();
    this.sub = this.viewport.renderedRangeStream
      .pipe(map(() => this.viewport.elementRef.nativeElement.scrollTop))
      .subscribe(offset => this.currentOffset = offset);
  }

  detach() {
    this.indexChange.complete();
    this.viewport = null;
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onContentScrolled() {
    this.updateRenderedRange();
  }

  updateItemAndBufferSize(itemSize: number, minBufferPx: number, maxBufferPx: number) {
    if (maxBufferPx < minBufferPx) {
      maxBufferPx = minBufferPx;
    }
    this.itemHeight = itemSize;
    this.minBufferPx = minBufferPx;
    this.maxBufferPx = maxBufferPx;
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  setDataLength(length: number): void {
    if (this.dataLength !== length) {
      this.dataLength = length;
      // console.log( ' data length change=', length)
      this.onDataLengthChanged();
    }
  }

  checkViewportSize() {
    this.viewport.checkViewportSize();
  }

  onDataLengthChanged() {
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  onContentRendered() { }
  onRenderedOffsetChanged() { }

  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (this.viewport) {
      this.viewport.scrollToOffset(index * this.itemHeight, behavior);
    }
  }

  private updateTotalContentSize() {
    if (this.viewport) {
      const viewportRange = Math.ceil(this.viewport.getViewportSize() / this.itemHeight) + 1;
      const buffer = this.dataLength >= viewportRange ? this.viewportBuffer : 0;
      this.contentSize = (this.dataLength + buffer) * this.itemHeight;
      this.viewport.setTotalContentSize(this.contentSize);
    }
  }

  private updateRenderedRange() {
    if (!this.viewport) {
      return;
    }
    const scrollOffset = this.viewport.measureScrollOffset();
    let firstVisibleIndex = scrollOffset / this.itemHeight;
    const renderedRange = this.viewport.getRenderedRange();
    const newRange = { start: renderedRange.start, end: renderedRange.end };
    const viewportSize = this.viewport.getViewportSize();
    const dataLength = this.dataLength;
    // console.info(' dataLength =' + dataLength + ' viewportSize =' + viewportSize +
    //  ' scrollOffset =' + scrollOffset + ' this.itemHeight =' + this.itemHeight +
    //  'minBufferPx = ' + this.minBufferPx )
    // const oldRange = { start: renderedRange.start, end: renderedRange.end };
    const startBuffer = scrollOffset - newRange.start * this.itemHeight;
    if (startBuffer < this.minBufferPx && newRange.start !== 0) {
      const expandStart = Math.ceil((this.maxBufferPx - startBuffer) / this.itemHeight);
      newRange.start = Math.max(0, newRange.start - expandStart);
      newRange.end = Math.min(dataLength,
        Math.ceil(firstVisibleIndex + (viewportSize + this.minBufferPx) / this.itemHeight));
    } else {
      const endBuffer = newRange.end * this.itemHeight - (scrollOffset + viewportSize);
      if (endBuffer < this.minBufferPx && newRange.end !== dataLength) {
        const expandEnd = Math.ceil((this.maxBufferPx - endBuffer) / this.itemHeight);
        if (expandEnd > 0) {
          newRange.end = Math.min(dataLength, newRange.end + expandEnd);
          newRange.start = Math.max(0,
            Math.floor(firstVisibleIndex - this.minBufferPx / this.itemHeight));
        }
      }
    }
    this.viewport.setRenderedRange(newRange);
    this.viewport.setRenderedContentOffset(this.itemHeight * newRange.start);
    if (this.isMouseWheelUp) {
      this.viewport.elementRef.nativeElement.scrollTop = this.itemHeight * firstVisibleIndex;
    }
    // console.log(' firstVisibleIndex=', firstVisibleIndex, ' eeeeeeeeeeeeeeeeee', newRange)
    // console.log('itemHeight * firstVisibleIndex=', this.itemHeight * firstVisibleIndex,
    //  ' vstop =', this.viewport.elementRef.nativeElement.scrollTop)
    firstVisibleIndex = Math.floor(firstVisibleIndex);
    if (firstVisibleIndex === this.previousIndex) {
      firstVisibleIndex++;
    }
    this.previousIndex = firstVisibleIndex;
    this.indexChange.next(firstVisibleIndex);
  }
}

