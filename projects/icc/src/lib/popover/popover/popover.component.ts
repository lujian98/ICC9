import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, ComponentFactoryResolver, Input, TemplateRef, Type, ViewChild } from '@angular/core';
import { IccOverlayContainerComponent, IccRenderableContainer } from '../overlay-container.component';
import { IccOverlayComponentRef } from '../../services/overlay/overlay-component-ref';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class IccPopoverComponent<T> implements IccRenderableContainer, AfterViewInit {
  @Input() content: any;
  @Input() context: {};
  @Input() cfr: ComponentFactoryResolver;

  @ViewChild(IccOverlayContainerComponent) overlayContainer: IccOverlayContainerComponent;

  constructor(
    private popoverRef: IccOverlayComponentRef<T>,
    // private _viewContainerRef: ViewContainerRef
  ) { }

  renderContent() {
    console.log( '222222222222  this.overlayContainer =', this.overlayContainer)

    this.detachContent();
    this.attachContent();
  }

  ngAfterViewInit() {
    this.content = this.popoverRef.componentContent;
    console.log( 'eeeeeeeeeeeeee  this.overlayContainer =', this.overlayContainer)
    this.renderContent();
  }

  protected detachContent() {
    // this.overlayContainer.detach();
  }

  protected attachContent() {

    if (this.content instanceof TemplateRef) {
      this.attachTemplate();
    } else if (this.content instanceof Type) {
      this.attachComponent();
    }
  }

  protected attachTemplate() {
    this.overlayContainer.attachTemplatePortal(
      new TemplatePortal(this.content, null, <any>{ $implicit: this.context })
    );
  }

  protected attachComponent() {
    const portal = new ComponentPortal(this.content, null, null, this.cfr);
    const ref = this.overlayContainer.attachComponentPortal(portal, this.context);
    ref.changeDetectorRef.detectChanges();
  }


  /*
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
  } */
}

