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
  @Input() layout: string;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.setPanelHeight();
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.height) {
      this.setPanelHeight();
    }
  }

  private setPanelHeight() {
    const el = this.elementRef.nativeElement;
    if (this.layout === 'fit') {
      this.height = null;
      this.width = null;
      this.resizeable = null;
      this.setFitLayout();
    } else if (!this.height) {
      this.height = 'calc(100vh - 50px)'; // default is calc(100vh - 50px) -> 50px is top nav bar height
    }
    if (this.height) {
      el.style.height = this.height;
    }
    if (this.width) {
      el.style.width = this.width;
    }
    if (this.resizeable) {
      el.style.position = 'absolute';
    }
  }

  private setFitLayout() { // TODO fit width if width is set
    const el = this.elementRef.nativeElement;
    // console.log(' el =', this.elementRef)
    const ownerCt = this.getParentElement();
    console.log(' ownerCt =', ownerCt, ' height =', ownerCt.clientHeight);
    if (ownerCt) {
      el.style.height = `${ownerCt.clientHeight}px`;
    }
  }

  private getParentElement() {
    const el = this.elementRef.nativeElement;
    let ownerCt = el.parentNode.parentNode;
    if (!ownerCt || ownerCt.clientHeight <= 0) {
      ownerCt = ownerCt.parentNode;
    }
    return ownerCt;
  }

  onResizePanel(resizeInfo: ResizeInfo) {
    if (resizeInfo.isResized) {
      const el = this.elementRef.nativeElement;
      el.style.height = resizeInfo.height * resizeInfo.scaleY + 'px';
      el.style.width = resizeInfo.width * resizeInfo.scaleX + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent) {
    if (this.layout === 'fit') {
      this.setFitLayout();
    }
  }
}

