import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ResizeInfo } from '../../directives/resize/model';

@Component({
  selector: 'icc-panel-content',
  templateUrl: './panel-content.component.html',
  styleUrls: ['./panel-content.component.scss']
})
export class IccPanelContentComponent implements AfterContentInit, AfterViewInit {
  @Input() resizeable: boolean;
  @ViewChild('tplLeftRightResize', { static: true }) tplLeftRightResize: TemplateRef<any>;
  @ViewChild('contentLeftRightResize', { read: ViewContainerRef }) contentLeftRightResize: ViewContainerRef;
  @ViewChild('tplRightLeftResize', { static: true }) tplRightLeftResize: TemplateRef<any>;
  @ViewChild('contentRightLeftResize', { read: ViewContainerRef }) contentRightLeftResize: ViewContainerRef;

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
    // console.log(' start =', start, ' middle=', middle, ' end=', end);
    if (start !== null && (middle !== null || end !== null)) {
      this.contentLeftRightResize.createEmbeddedView(this.tplLeftRightResize);
    }
    if (end !== null && middle !== null) {
      this.contentRightLeftResize.createEmbeddedView(this.tplRightLeftResize);
    }
  }

  ngAfterContentInit() {
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

