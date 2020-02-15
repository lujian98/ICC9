import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'my-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'my-demo';

  sidemenuRef: any;
  constructor() {
  }

  ngOnInit() {
  }

  onActivate(componentRef) {
    this.sidemenuRef = componentRef;
  }

  onSideMenuNavIconClick($event) {
    if (this.sidemenuRef) {
      this.sidemenuRef.sideNavOpened = !this.sidemenuRef.sideNavOpened;
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }
}
