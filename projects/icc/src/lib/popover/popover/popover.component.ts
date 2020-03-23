import { Component, OnInit, TemplateRef } from '@angular/core';
import { IccOverlayComponentRef } from '../../services/overlay/overlay-component-ref';
import { IccOverlayComponentContent } from '../../services/overlay/overlay.model';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class IccPopoverComponent<T> implements OnInit {
  popoverType: 'text' | 'template' | 'component' = 'component';
  content: IccOverlayComponentContent<T>;
  context: any;

  constructor(
    private popoverRef: IccOverlayComponentRef<T>
  ) { }

  ngOnInit() {
    this.content = this.popoverRef.overlayContent.content;
    if (typeof this.content === 'string') {
      this.popoverType = 'text';
    }
    if (this.content instanceof TemplateRef) {
      this.popoverType = 'template';
      this.context = {
        close: this.popoverRef.close.bind(this.popoverRef)
      };
    }
  }
}

