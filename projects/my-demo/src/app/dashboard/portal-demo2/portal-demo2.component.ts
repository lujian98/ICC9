import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './portal-demo2.component.html',
  styleUrls: ['./portal-demo2.component.scss']
})
export class PortalDemo2Component implements OnInit {
  skills = [];
  values: string;

  constructor(
    // private popoverRef: IccOverlayComponentRef<any>
  ) { }

  ngOnInit() {
    this.values = this.skills.toString().replace(/[',"]+/g, ', ');
  }
}
