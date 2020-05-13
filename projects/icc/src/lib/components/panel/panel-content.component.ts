import { AfterViewInit, Component, ElementRef, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ResizeInfo } from '../../directives/resize/model';

@Component({
  selector: 'icc-panel-content',
  templateUrl: './panel-content.component.html',
  styleUrls: ['./panel-content.component.scss']
})
export class IccPanelContentComponent implements AfterViewInit {
  @Input() resizeable: boolean;
  @ViewChild('tplResizeLeftRight', { static: true }) tplResizeLeftRight: TemplateRef<any>;
  @ViewChild('tplResizeRightLeft', { static: true }) tplResizeRightLeft: TemplateRef<any>;
  @ViewChild('tplResizeTopBottom', { static: true }) tplResizeTopBottom: TemplateRef<any>;
  @ViewChild('tplResizeBottomTop', { static: true }) tplResizeBottomTop: TemplateRef<any>;
  @ViewChild('contentResizeLeftRight', { read: ViewContainerRef }) contentResizeLeftRight: ViewContainerRef;
  @ViewChild('contentResizeRightLeft', { read: ViewContainerRef }) contentResizeRightLeft: ViewContainerRef;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit() { // TODO check if the child content changes
    if (this.resizeable) {
      this.checkResizeCondition();
      this.checkPanelHeight();
      window.dispatchEvent(new Event('resize'));
    }
  }

  private checkResizeCondition() {
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
}

