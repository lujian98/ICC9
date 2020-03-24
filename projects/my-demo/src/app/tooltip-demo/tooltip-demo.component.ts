import { Component, OnInit } from '@angular/core';
import { IccOverlayComponentRef } from 'icc';

@Component({
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss']
})
export class TooltipDemoComponent implements OnInit {
  skills = [];
  constructor(
    private popoverRef: IccOverlayComponentRef<any>
  ) { }

  ngOnInit() { }

  close() {
    this.popoverRef.close({ id: 1 });
  }
}
