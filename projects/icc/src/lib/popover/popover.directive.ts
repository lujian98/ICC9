import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { IccOverlayComponentContent, IccOverlayConfig } from '../services/overlay/overlay.model';
import { IccPopoverService } from './popover.service';
import { IccBasePopoverStrategy, IccPopoverHoverStrategy } from './popover.strategy';
import { IccPopoverComponent } from './popover/popover.component';

@Directive({
  selector: '[iccPopover]'
})
export class IccPopoverDirective<T> implements OnInit, OnDestroy {
  @Input('iccPopover') content: IccOverlayComponentContent<T>;
  @Input('iccPopoverContext') context = {};
  @Input() width: string | number = 200;
  @Input() height: string | number;
  @Input() disabled = false;

  private popoverStrategy: IccBasePopoverStrategy;
  private overlayRef: OverlayRef;
  private overlayConfig: IccOverlayConfig = {
    panelClass: '',
    backdropClass: 'popover-backdrop',
  };
  private isOpened = false;

  constructor(
    private overlayService: IccPopoverService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    if (!this.disabled) {
      this.popoverStrategy = new IccPopoverHoverStrategy(document, this.elementRef.nativeElement);
      this.popoverStrategy.show$.subscribe(() => this.openPopover());
      this.popoverStrategy.hide$.subscribe(() => this.closePopover());
    }
  }

  private openPopover() {
    this.isOpened = true;
    const overlayConfig: IccOverlayConfig = {
      width: this.width,
      height: this.height,
      ...this.overlayConfig
    };
    this.overlayRef = this.overlayService.open(
      this.elementRef.nativeElement,
      IccPopoverComponent,
      overlayConfig,
      this.content,
      this.context
    );
    this.popoverStrategy.isOpened = this.isOpened;
    this.popoverStrategy.overlayRef = this.overlayRef;
  }

  private closePopover() {
    this.isOpened = false;
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.popoverStrategy.isOpened = this.isOpened;
    this.popoverStrategy.overlayRef = null;
  }

  ngOnDestroy() { }
}

