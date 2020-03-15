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
    document.querySelector('.app-container').classList.remove('dark-theme');
    document.querySelector('.app-container').classList.remove('light-theme');
    if (data.value === 'light') {
      document.querySelector('.app-container').classList.add('light-theme');
    } else if (data.value === 'dark') {
      document.querySelector('.app-container').classList.add('dark-theme');
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