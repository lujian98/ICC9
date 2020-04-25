import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
// import { MatDrawer } from '@angular/material/sidenav';


@Component({
  selector: 'icc-demo-header-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  // @Input() sidemenunav: MatDrawer;

  @Output() sideMenuNavIconClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly router: Router
  ) {
  }

  changeTheme(data) {
    document.querySelector('.app-theme').classList.remove('theme-light');
    document.querySelector('.app-theme').classList.remove('theme-dark');
    document.querySelector('.app-theme').classList.remove('theme-red');
    document.querySelector('.app-theme').classList.remove('theme-blue');
    if (data.value === 'light') {
      document.querySelector('.app-theme').classList.add('theme-light');
    } else if (data.value === 'dark') {
      document.querySelector('.app-theme').classList.add('theme-dark');
    } else if (data.value === 'red') {
      document.querySelector('.app-theme').classList.add('theme-red');
    } else if (data.value === 'blue') {
      document.querySelector('.app-theme').classList.add('theme-blue');
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