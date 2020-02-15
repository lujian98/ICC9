import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// this is old GridTableVirtualScrollStrategy for 7.0,
// firefox, edge, safari will have jump with mouse wheel scrolling
export class GridTableVirtualScrollStrategy implements VirtualScrollStrategy {
  scrolledIndexChange: Observable<number>;

  private dataLength = 0;
  private _viewportBuffer = 5;
  private readonly indexChange = new Subject<number>();
  private viewport: CdkVirtualScrollViewport;
  private previousChange = -1;

  set viewportBuffer(val: number) {
    this._viewportBuffer = val;
  }

  get viewportBuffer(): number {
    return this._viewportBuffer;
  }

  constructor(private itemHeight: number) {
    this.scrolledIndexChange = this.indexChange.pipe(distinctUntilChanged());
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.onDataLengthChanged();
  }

  checkViewportSize() {
    this.viewport.checkViewportSize();
  }

  onContentScrolled(): void {
    this.updateContent();
  }

  onDataLengthChanged(): void {
    if (this.viewport) {
      const viewportRange = Math.ceil(this.viewport.getViewportSize() / this.itemHeight) + 1;
      const buffer = this.dataLength >= viewportRange ? this.viewportBuffer : 0;
      this.viewport.setTotalContentSize((this.dataLength + buffer) * this.itemHeight);
      this.updateContent();
    }
  }

  setDataLength(length: number): void {
    if (this.dataLength !== length) {
      this.dataLength = length;
      this.onDataLengthChanged();
    }
  }

  setItemHeight(rowHeight: number) {
    this.itemHeight = rowHeight;
    this.onDataLengthChanged();
    this.updateContent();
  }

  detach(): void {
    this.indexChange.complete();
  }
  onContentRendered(): void { }
  onRenderedOffsetChanged(): void { }

  // to use this: this.viewport.scrollToIndex(40, "smooth");
  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    // scroll to index only to max avialble index
    // const top = index * this.itemHeight - this.headerOffset;
    index = (index >= 0) ? index : 1;
    const top = (index - 1) * this.itemHeight;
    this.viewport.elementRef.nativeElement.scrollTop = top;
    this.updateContent();
  }

  private updateContent(): void {
    if (!this.viewport) {
      return;
    }
    const amount = Math.ceil(this.viewport.getViewportSize() / this.itemHeight);
    const offset = this.viewport.measureScrollOffset(); //  - this.headerOffset;
    const skip = Math.round(offset / this.itemHeight);
    const index = Math.max(0, skip);
    const start = Math.max(0, index);
    const end = Math.min(this.dataLength, amount + skip);

    if (end === 0) {
      return;
    }
    this.viewport.setRenderedContentOffset(this.itemHeight * start);
    this.viewport.setRenderedRange({ start, end });

    let currentChange = start + end;
    if (currentChange === this.previousChange) {
      currentChange++;
    }
    this.previousChange = currentChange;

    // console.log('index=' + index + ' start=' + start + ' end =' + end + ' this.itemHeight =' + this.itemHeight);

    setTimeout(() => {
      this.indexChange.next(currentChange);
    }, 1);
  }
}
