import { Component, OnInit } from '@angular/core';
import { IccOverlayComponentRef } from 'icc';

@Component({
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss']
})
export class TooltipDemoComponent implements OnInit {
  skills = [];
  constructor(
    private overlayComponentRef: IccOverlayComponentRef<any>
  ) { }

  ngOnInit() { }

  close() {
    this.overlayComponentRef.close({ id: 1 });
      // TODO this may not be enough to close tooltip need add close events subject to popover directive
  }
}
