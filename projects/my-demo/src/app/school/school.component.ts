import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UsersDataService } from './users/users-data.service';


@Component({
  selector: 'icc-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit, OnDestroy {
  title = 'Grid Demo';
  isVisible = true;
  queryParams: any;

  private readonly subMedia: Subscription;
  media$: MediaChange;

  sideNavOpened: boolean = true;
  sideNavMode: 'side' | 'over' = 'side';
  toolBarHeight = 64; //TODO

  constructor(
    media: MediaObserver,
    private router: Router,
    private dataSourceService: UsersDataService,
  ) {
    this.subMedia = media.media$.subscribe((change: MediaChange) => {
      this.media$ = change;
      this.setMediaChange(change);
    });
    const userInfo = this.dataSourceService.userInfo;
    if (userInfo) { //  && userInfo.username === 'Admin'
      this.isVisible = userInfo.usertype === 'Admin' ? true : false;
      this.queryParams = {deviceid: userInfo.deviceid};
    }
  }

  ngOnInit() {
  }

  onClassRegistration() {
    this.router.navigate(['school/class-registration'], { queryParams: { deviceid: this.dataSourceService.userInfo.deviceid}});
  }

  private setMediaChange(change: MediaChange) {
    if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
      if (this.sideNavOpened) {
        this.sideNavOpened = false;
      }
      this.sideNavMode = 'over';
    } else {
      this.sideNavOpened = true;
      this.sideNavMode = 'side';
    }
    if (change.mqAlias === 'xs') {
      this.toolBarHeight = 56;
    } else {
      this.toolBarHeight = 64;
    }
  }

  ngOnDestroy() {
    this.subMedia.unsubscribe();
  }
}
