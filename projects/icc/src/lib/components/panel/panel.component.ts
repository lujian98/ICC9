import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
    if (!this.height) {
      this.height = 'calc(100vh - 60px)'; // default is calc(100vh - 60px) -> 60px is top nav bar height + 10px
    }
    el.style.height = this.height;
    if (this.width) {
      el.style.width = this.width;
    }
    if (this.resizeable) {
      el.style.position = 'absolute';
    }
  }

  onResizePanel(resizeInfo: ResizeInfo) {
    if (resizeInfo.isResized) {
      const el = this.elementRef.nativeElement;
      el.style.height = resizeInfo.height * resizeInfo.scaleY + 'px';
      el.style.width = resizeInfo.width * resizeInfo.scaleX + 'px';
    }
  }
}

