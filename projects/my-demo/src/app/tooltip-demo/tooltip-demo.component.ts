import { Component } from '@angular/core';
import { IccOverlayComponentRef } from 'icc';

@Component({
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss']
})
export class TooltipDemoComponent {
  skills;
  constructor(private popoverRef: IccOverlayComponentRef<any>) {
    console.log( ' this.tooltipRef =', this.popoverRef);
    this.skills = this.popoverRef.overlayContent.data.skills;
  }

  close() {
    this.popoverRef.close({ id: 1 });
  }
}
