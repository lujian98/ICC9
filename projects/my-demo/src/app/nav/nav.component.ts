import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
// import { MatDrawer } from '@angular/material/sidenav';


@Component({
  selector: 'icc-demo-header-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  // @Input() sidemenunav: MatDrawer; constructor(public overlayContainer: OverlayContainer){}

  @Output() sideMenuNavIconClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly router: Router,
    public overlayContainer: OverlayContainer
  ) {
    this.overlayContainer.getContainerElement().classList.add('icc-theme-light');
  }

  changeTheme(data) {
    document.querySelector('.app-theme').classList.remove('icc-theme-light');
    document.querySelector('.app-theme').classList.remove('icc-theme-dark');
    this.overlayContainer.getContainerElement().classList.remove('icc-theme-light');
    this.overlayContainer.getContainerElement().classList.remove('icc-theme-dark');
    if (data.value === 'light') {
      document.querySelector('.app-theme').classList.add('icc-theme-light');
      this.overlayContainer.getContainerElement().classList.add('icc-theme-light');
    } else if (data.value === 'dark') {
      document.querySelector('.app-theme').classList.add('icc-theme-dark');
      this.overlayContainer.getContainerElement().classList.add('icc-theme-dark');
    }
  }

  onLoggedout() {
    localStorage.removeItem('isLoggedin');
    this.router.navigate(['login']);
  }

  toggleSideMenuNav() {
    // this.sidemenunav.toggle();
    this.sideMenuNavIconClickEvent.emit(true);
    /*
    setTimeout(() => {
      var resizeEvent = window.document.createEvent('UIEvents');
      resizeEvent.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(resizeEvent);
    }, 250); */
  }
}