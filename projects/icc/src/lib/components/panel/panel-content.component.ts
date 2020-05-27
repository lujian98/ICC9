import { AfterViewInit, AfterContentInit, Component, ElementRef, OnDestroy, Input, QueryList, ContentChildren,
  TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { ResizeInfo } from '../../directives/resize/model';

export interface IccSize {
  height: number;
  width: number;
}

@Component({
  selector: 'icc-panel-content',
  templateUrl: './panel-content.component.html',
  styleUrls: ['./panel-content.component.scss']
})
export class IccPanelContentComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  @Input() resizeable: boolean;
  @ViewChild('tplResizeLeftRight', { static: true }) tplResizeLeftRight: TemplateRef<any>;
  @ViewChild('tplResizeRightLeft', { static: true }) tplResizeRightLeft: TemplateRef<any>;
  @ViewChild('tplResizeTopBottom', { static: true }) tplResizeTopBottom: TemplateRef<any>;
  @ViewChild('tplResizeBottomTop', { static: true }) tplResizeBottomTop: TemplateRef<any>;
  @ViewChild('contentResizeLeftRight', { read: ViewContainerRef }) contentResizeLeftRight: ViewContainerRef;
  @ViewChild('contentResizeRightLeft', { read: ViewContainerRef }) contentResizeRightLeft: ViewContainerRef;

  @ContentChildren('divContainer', { read: ViewContainerRef }) divContainer: QueryList<ViewContainerRef>;


  private alive = true;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit() {
    if (this.resizeable) {
      this.setupPanelSizeObserver();
      this.checkResizeCondition();
    }
  }

  ngAfterContentInit() {
    // console.log( ' 5555555555 this.divContainer=', this.divContainer)
  }


  private setupPanelSizeObserver() {
    new Observable<IccSize>(observer => {
      const config = { attributes: true, childList: true, subtree: true };
      new MutationObserver(() => observer.next(this.getPanelSize())
      ).observe(this.elementRef.nativeElement, config);
    }).pipe(
      debounceTime(50),
      distinctUntilChanged(),
      takeWhile(() => this.alive)
    ).subscribe((size => this.initPanelSize()));
  }

  getPanelSize(): IccSize {
    return {
      height: this.elementRef.nativeElement.offsetHeight,
      width: this.elementRef.nativeElement.offsetWidth
    };
  }

  private initPanelSize() {
    this.checkPanelHeight();
    window.dispatchEvent(new Event('resize'));
  }

  private checkResizeCondition() { // TODO createEmbeddedView will disable the html input???
    console.log( ' 111111111111 this.divContainer=', this.divContainer, ' this.elementRef=', this.elementRef)
    const elements: HTMLDivElement[] = Array.from(this.elementRef.nativeElement.children);
    let start = null;
    let middle = null;
    let end = null;
    elements.forEach((el: HTMLDivElement) => {
      if (start === null) {
        start = el.getAttribute('start');
      }
      if (middle === null) {
        middle = el.getAttribute('middle');
      }
      if (end === null) {
        end = el.getAttribute('end');
      }
    });
    const style = window.getComputedStyle(this.elementRef.nativeElement);
    if (start !== null && (middle !== null || end !== null)) {
      if (style.flexDirection === 'row') {
        this.contentResizeLeftRight.createEmbeddedView(this.tplResizeLeftRight);
      } else if (style.flexDirection === 'column') {
        this.contentResizeLeftRight.createEmbeddedView(this.tplResizeTopBottom);
      }
    }
    if (end !== null && middle !== null) {
      if (style.flexDirection === 'row') {
        this.contentResizeRightLeft.createEmbeddedView(this.tplResizeRightLeft);
      } else if (style.flexDirection === 'column') {
        this.contentResizeRightLeft.createEmbeddedView(this.tplResizeBottomTop);
      }
    }
  }

  onResizePanel(resizeInfo: ResizeInfo) {
    if (resizeInfo.isResized) {
      this.checkPanelHeight();
    }
  }

  private checkPanelHeight() {
    const natEl = this.elementRef.nativeElement;
    const style = window.getComputedStyle(natEl);
    if (style.flexDirection === 'column' && natEl.scrollHeight !== natEl.clientHeight) {
      const dh = natEl.scrollHeight - natEl.clientHeight;
      const elements: HTMLDivElement[] = Array.from(natEl.children);
      // console.log(' mmmmmm dh =', dh, ' scrollHeight= ', natEl.scrollHeight, ' clientHeight=', natEl.clientHeight);
      const els = elements.filter((element: HTMLDivElement) => element.getAttribute('middle') !== null);
      if (els.length === 1) {
        const height = els[0].clientHeight - dh;
        els[0].style.height = `${height}px`;
      }
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

