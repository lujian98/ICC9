import { Component } from '@angular/core';
import { IccOverlayComponentRef } from 'icc';

@Component({
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss']
})
export class TooltipDemoComponent {
  skills;
  constructor(private tooltipRef: IccOverlayComponentRef) {
    console.log( ' this.tooltipRef =', this.tooltipRef);
    this.skills = this.tooltipRef.overlayContent.data.skills;
  }

  close() {
    this.tooltipRef.close({ id: 1 });
  }
}
