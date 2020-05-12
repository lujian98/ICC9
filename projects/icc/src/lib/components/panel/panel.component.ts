import {
  AfterContentInit, AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges,
  OnInit, SimpleChanges, ContentChildren, ViewContainerRef, QueryList, ViewChild, TemplateRef
} from '@angular/core';
import { ResizeInfo } from '../../directives/resize/model';
import { IccPanelContentComponent } from './panel-content.component';

@Component({
  selector: 'icc-panel-header',
  template: `<ng-content></ng-content>`
})
export class IccPanelHeaderComponent { }

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
export class IccPanelComponent implements AfterViewInit, AfterContentInit, OnInit, OnChanges {
  @Input() height: string;
  @Input() width: string;
  @Input() resizeable: boolean;
  @Input() layout = 'fit'; // fit | viewport

  @ViewChild('templateToAppend', { static: true }) templateToAppend: TemplateRef<any>;
  @ContentChildren(IccPanelContentComponent, { descendants: true, read: ViewContainerRef })
  contentComponents: QueryList<ViewContainerRef>;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
    this.initPanelSize();
  }

  ngAfterContentInit() {
    // if (this.resizeable) {
      console.log(' 3322222222222222222 this.contentComponents=', this.contentComponents)
      this.contentComponents.forEach(ap => { // TODO this only works without ivy
        console.log(' ap=', ap);
        ap.createEmbeddedView(this.templateToAppend);
      });
      // this.viewContainerRef.createEmbeddedView(this.templateToAppend);
    // }
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  private initPanelSize() {
    if (this.layout === 'viewport' || this.layout === 'fit') {
      this.setFitLayout();
    }
    if (this.height) {
      this.setHeight(this.height);
    }
    if (this.width) {
      this.setWidth(this.width);
    }
  }

  private setFitLayout() { // TODO fit width if width is set
    const size = this.getParentSize();
    if (size) {
      this.setHeight(`${size.height}px`);
      if (this.layout === 'viewport') {
        this.setWidth(`${size.width}px`);
      }
    }
  }

  private setHeight(height: string) {
    const el = this.elementRef.nativeElement;
    el.style.height = height;
  }

  private setWidth(width: string) {
    const el = this.elementRef.nativeElement;
    el.style.width = width;
    el.parentNode.style.width = width;
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
      const height = resizeInfo.height * resizeInfo.scaleY;
      const width = resizeInfo.width * resizeInfo.scaleX;
      this.setHeight(`${height}px`);
      this.setWidth(`${width}px`);
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent) {
    if (this.layout === 'fit' || this.layout === 'viewport') {
      this.setFitLayout();
    }
  }
}

