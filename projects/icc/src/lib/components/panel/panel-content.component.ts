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
  @ViewChild('contentResize', { read: ViewContainerRef }) contentResize: ViewContainerRef;

  // @ViewChildren(IccPanelContentComponent) viewChildren: QueryList<IccPanelContentComponent>;
  // @ContentChildren(IccPanelContentComponent) contentChildren: QueryList<IccPanelContentComponent>;

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
    elements.forEach((el: HTMLDivElement) => {
      const start = el.getAttribute('start'); // TODO add more conditions
      if (start !== null) {
        this.contentResize.createEmbeddedView(this.tplLeftRightResize);
      }
    });
  }

  ngAfterContentInit() {
  }

  onResizePanel(resizeInfo: ResizeInfo) {
    if (resizeInfo.isResized) {
      const height = resizeInfo.height * resizeInfo.scaleY;
      const width = resizeInfo.width * resizeInfo.scaleX;
      // this.setHeight(`${height}px`);
      // this.setWidth(`${width}px`);
    }
  }
}

