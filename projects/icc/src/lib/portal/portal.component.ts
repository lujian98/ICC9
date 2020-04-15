import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, Type, ViewChild } from '@angular/core';
import { IccPortalContent } from './model';
// import { IccOverlayService } from '../services/overlay/overlay.service';
import { IccOverlayComponentRef } from '../services/overlay/overlay-component-ref';

@Component({
  selector: 'icc-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class IccPortalComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input() content: IccPortalContent<T>;
  @Input() context: {};
  @Input() withBackground: boolean;
  portalType: string;
  overlayComponentRef: IccOverlayComponentRef<T>;

  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  constructor() { }

  ngOnInit() {
    if (this.content instanceof Type) {
      this.portalType = 'component';
    } else if (this.content instanceof TemplateRef) {
      this.portalType = 'template';
    } else {
      this.portalType = 'text';
    }
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
      console.log( ' this.overlayComponentRef =', this.overlayComponentRef)
      this.context = { // TODO bind not working???
        close: this.overlayComponentRef.close
      };
      // close: this.popoverRef.close.bind(this.popoverRef)
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

