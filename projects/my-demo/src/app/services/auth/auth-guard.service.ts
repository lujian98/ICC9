import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';

import { UsersDataService } from '../../school/users/users-data.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private dataSourceService: UsersDataService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log(state.url);
    // if (localStorage.getItem('isLoggedin')) {
    // if (this.dataSourceService.userInfo) {
    return true;
    // }
    /*
    this.router.navigate(['login']);
    return false; */
  }
}
