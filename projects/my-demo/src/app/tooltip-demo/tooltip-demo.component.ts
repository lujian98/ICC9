import { Component, OnInit } from '@angular/core';
import { IccOverlayComponentRef, IccOverlayService } from 'icc';

@Component({
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss']
})
export class TooltipDemoComponent implements OnInit {
  skills = [];
  constructor(
    // private popoverRef: IccOverlayComponentRef<any>
    private overlayService: IccOverlayService,
  ) { }

  ngOnInit() { }

  close() {
    console.log(' close =', this.overlayService)
    this.overlayService.close(); // TODO this may not be enough to close tooltip need add close events subject to popover directive
    // this.popoverRef.close({ id: 1 });
  }
}
