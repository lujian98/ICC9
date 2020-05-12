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
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngAfterViewInit() {
    if (this.resizeable) {
      this.checkResizeCondition();
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
    // console.log(' start =', start, ' middle=', middle, ' end=', end); // column
    if (start !== null && (middle !== null || end !== null)) {
      if (style.flexDirection === 'row') {
        this.contentResizeLeftRight.createEmbeddedView(this.tplResizeLeftRight);
      } else if (style.flexDirection === 'column') {
        // this.contentResizeLeftRight.createEmbeddedView(this.tplResizeTopBottom);
      }
    }
    if (end !== null && middle !== null) {
      if (style.flexDirection === 'row') {
        // this.contentResizeRightLeft.createEmbeddedView(this.tplResizeRightLeft);
      } else if (style.flexDirection === 'column') {
        // this.contentResizeRightLeft.createEmbeddedView(this.tplResizeBottomTop);
      }
    }
  }

  onResizePanel(resizeInfo: ResizeInfo) { // TODO not used ???
    if (resizeInfo.isResized) {
      const height = resizeInfo.height * resizeInfo.scaleY;
      const width = resizeInfo.width * resizeInfo.scaleX;
      // this.setHeight(`${height}px`);
      // this.setWidth(`${width}px`);
    }
  }
}

