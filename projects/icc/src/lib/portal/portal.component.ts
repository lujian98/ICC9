import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { IccPortalContent } from './model';

@Component({
  selector: 'icc-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class IccPortalComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input() content: IccPortalContent<T>;
  @Input() context: {};
  portalType: string;

  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  constructor(
    // private popoverRef: IccOverlayComponentRef<T>,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    // this.content = this.popoverRef.componentContent;
    this.portalType = (typeof this.content === 'string') ? 'text' : '';

  }

  ngAfterViewInit() {
    this.addPortalContent();
  }

  addPortalContent() {
    if (this.content instanceof Type) {
      const portal = new ComponentPortal(this.content);
      const componentRef = this.portalOutlet.attachComponentPortal(portal);
      if (this.context) {
        Object.assign(componentRef.instance, this.context);
        componentRef.changeDetectorRef.markForCheck();
        componentRef.changeDetectorRef.detectChanges();
      }
    } else if (this.content instanceof TemplateRef) {
      this.context = {
        // lose: this.popoverRef.close.bind(this.popoverRef)
      };
      const portal = new TemplatePortal(this.content, null, { $implicit: this.context } as any);
      const templateRef = this.portalOutlet.attachTemplatePortal(portal);
      templateRef.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
    }
  }
}

