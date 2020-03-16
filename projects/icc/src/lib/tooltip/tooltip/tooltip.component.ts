import { Component, OnInit, TemplateRef } from '@angular/core';
import { IccOverlayComponentRef } from '../../services/overlay/overlay-component-ref';
import { IccOverlayComponentContent } from '../../services/overlay/overlay.model';

@Component({
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class IccTooltipComponent<T> implements OnInit {
  tooltipType: 'text' | 'template' | 'component' = 'component';
  content: IccOverlayComponentContent<T>;
  context: any;

  constructor(
    private tooltipRef: IccOverlayComponentRef
  ) { }

  ngOnInit() {
    this.content = this.tooltipRef.overlayContent.content;
    if (typeof this.content === 'string') {
      this.tooltipType = 'text';
    }
    if (this.content instanceof TemplateRef) {
      this.tooltipType = 'template';
      this.context = {
        close: this.tooltipRef.close.bind(this.tooltipRef)
      };
    }
  }
}

