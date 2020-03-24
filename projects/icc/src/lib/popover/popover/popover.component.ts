import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { IccOverlayComponentRef } from '../../services/overlay/overlay-component-ref';
import { IccOverlayComponentContent } from '../../services/overlay/overlay.model';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class IccPopoverComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  popoverType: string;
  content: IccOverlayComponentContent<T>;
  context: any;

  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  constructor(
    private popoverRef: IccOverlayComponentRef<T>,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.content = this.popoverRef.componentContent;
    this.popoverType = (typeof this.content === 'string') ? 'text' : '';
  }

  ngAfterViewInit() {
    if (this.content instanceof TemplateRef) {
      this.context = {
        close: this.popoverRef.close.bind(this.popoverRef)
      };
      const portal = new TemplatePortal(this.content, null, { $implicit: this.context } as any);
      const templateRef = this.portalOutlet.attachTemplatePortal(portal);
      templateRef.detectChanges();
    } else if (this.content instanceof Type) {
      const portal = new ComponentPortal(this.content);
      const componentRef = this.portalOutlet.attachComponentPortal(portal);
      if (this.popoverRef.componentContext) {
        Object.assign(componentRef.instance, this.popoverRef.componentContext);
        componentRef.changeDetectorRef.markForCheck();
        componentRef.changeDetectorRef.detectChanges();
      }
    }
  }

  ngOnDestroy() {
    if (this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
    }
  }
}

