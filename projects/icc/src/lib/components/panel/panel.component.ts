import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResizeInfo } from '../../directives/resize/model';

@Component({
  selector: 'icc-panel-header',
  template: `<ng-content></ng-content>`
})
export class IccPanelHeaderComponent { }

@Component({
  selector: 'icc-panel-content',
  template: `<ng-content></ng-content>`
})
export class IccPanelContentComponent { }

@Component({
  selector: 'icc-panel-footer',
  template: `<ng-content></ng-content>`
})
export class IccPanelFooterComponent { }

@Component({
  selector: 'icc-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class IccPanelComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() height: string;
  @Input() width: string;
  @Input() resizeable: boolean;
  @Input() layout = 'fit'; // fit | viewport

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    this.setPanelHeight();
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.setPanelHeight();
  }

  private setPanelHeight() {
    console.log('this.elementRef= ', this.elementRef)
    const el = this.elementRef.nativeElement;
    if (this.layout === 'viewport') {
      this.setFitLayout();
    } else if (this.layout === 'fit') {
      // this.height = null;
      // this.width = null;
      // this.resizeable = null;
      this.setFitLayout();
      // } else if (!this.height) { // TODO remove with auto fit layout???
      //  this.height = 'calc(100vh - 50px)'; // default is calc(100vh - 50px) -> 50px is top nav bar height
    }
    if (this.height) {
      this.setHeight(this.height);
    }
    if (this.width) {
      // el.style.width = this.width;
      this.setWidth(this.width);
    }
    if (this.resizeable) {
      el.style.position = 'absolute';
    }
  }

  private setFitLayout() { // TODO fit width if width is set
    // const el = this.elementRef.nativeElement;
    const size = this.getParentSize();
    if (size) {
      this.setHeight(`${size.height}px`);
      if (this.layout === 'viewport') {
        // el.style.width = `${size.width}px`;
        this.setWidth(`${size.width}px`);
      }
    }
  }

  private setHeight(height: string) {
    const el = this.elementRef.nativeElement.firstChild;
    el.style.height = height;
  }

  private setWidth(width: string) {
    const el = this.elementRef.nativeElement.parentNode;
    el.style.width = width;
  }

  private getParentSize() {
    let size = null;
    if (this.layout === 'viewport') {
      size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
      };
    } else {
      const el = this.elementRef.nativeElement;
      let ownerCt = el.parentNode.parentNode;
      if (!ownerCt || ownerCt.clientHeight <= 0) {
        ownerCt = ownerCt.parentNode;
      }
      if (ownerCt) {
        size = { width: ownerCt.clientWidth, height: ownerCt.clientHeight };
      }
    }
    return size;
  }

  onResizePanel(resizeInfo: ResizeInfo) {
    if (resizeInfo.isResized) {
      // const el = this.elementRef.nativeElement;
      const height = resizeInfo.height * resizeInfo.scaleY;
      const width = resizeInfo.width * resizeInfo.scaleX;
      this.setHeight(`${height}px`);
      this.setWidth(`${width}px`);
      // el.style.height = resizeInfo.height * resizeInfo.scaleY + 'px';
      // el.style.width = resizeInfo.width * resizeInfo.scaleX + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent) {
    if (this.layout === 'fit' || this.layout === 'viewport') {
      this.setFitLayout();
    }
  }
}

