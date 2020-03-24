import { ComponentPortal, Portal, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, OnInit, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { IccOverlayComponentRef } from '../../services/overlay/overlay-component-ref';
import { IccOverlayComponentContent } from '../../services/overlay/overlay.model';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class IccPopoverComponent<T> implements OnInit, AfterViewInit {
  popoverType: 'text' | 'template' | 'component' = 'component';
  content: IccOverlayComponentContent<T>;
  context: any;

  // @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  // @ViewChild('testPortalOutlet') portalOutlet: CdkPortalOutlet;
  portal: Portal<any>;

  constructor(
    private popoverRef: IccOverlayComponentRef<T>,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.content = this.popoverRef.overlayContent.content;
    if (this.content instanceof TemplateRef) {
      this.context = {
        close: this.popoverRef.close.bind(this.popoverRef)
      };
      this.portal = new TemplatePortal(this.content, null, { $implicit: this.context } as any);
    } else if (this.content instanceof Type) {
      this.portal = new ComponentPortal(this.content);
    }
    console.log(' this.content =', this.popoverRef);

  }

  ngAfterViewInit() {
  }
}

