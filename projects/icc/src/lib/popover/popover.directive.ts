import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IccPortalContent } from '../portal/model';
import { IccPortalComponent } from '../portal/portal.component';
import { IccOverlayConfig } from '../services/overlay/overlay.model';
import { IccOverlayService } from '../services/overlay/overlay.service';
import { IccBasePopoverStrategy, IccPopoverClickStrategy, IccPopoverHoverStrategy } from './popover.strategy';


@Directive({
  selector: '[iccPopover]'
})
export class IccPopoverDirective<T> implements OnInit, OnDestroy {
  @Input('iccPopover') content: IccPortalContent<T>;
  @Input('iccPopoverContext') context = {};
  @Input() popoverPosition: string;
  @Input() width: string | number;
  @Input() height: string | number;
  @Input() popoverType: 'over' | 'click' | 'disabled' = 'over';

  private popoverStrategy: IccBasePopoverStrategy;
  private overlayRef: OverlayRef;
  private isOpened = false;

  constructor(
    private overlayService: IccOverlayService<T>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    if (this.popoverType !== 'disabled') { // afterClosed$
      if (this.popoverType === 'click') {
        this.popoverStrategy = new IccPopoverClickStrategy(document, this.elementRef.nativeElement);
      } else {
        this.popoverStrategy = new IccPopoverHoverStrategy(document, this.elementRef.nativeElement);
      }
      this.popoverStrategy.show$.subscribe(() => this.openPopover());
      this.popoverStrategy.hide$.subscribe(() => this.closePopover());
    }
  }

  private openPopover() {
    if (!this.isOpened) {
      this.isOpened = true;
      const overlayConfig: IccOverlayConfig = {
        position: this.popoverPosition,
        width: this.width,
        height: this.height
      };
      this.overlayRef = this.overlayService.open(
        this.elementRef.nativeElement,
        IccPortalComponent,
        overlayConfig,
        this.content,
        this.context
      );
      this.popoverStrategy.isOpened = this.isOpened;
      this.popoverStrategy.overlayRef = this.overlayRef;
      this.popoverStrategy.containerRef = this.overlayService.containerRef;
      this.overlayService.overlayComponentRef.afterClosed$.
        pipe(takeWhile(() => this.isOpened))
        .subscribe(() => this.closePopover());
    }
  }

  private closePopover() {
    this.isOpened = false;
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.popoverStrategy.isOpened = this.isOpened;
    this.popoverStrategy.overlayRef = null;
    this.popoverStrategy.containerRef = null;
  }

  ngOnDestroy() {
    this.overlayService.destroy();
  }
}

