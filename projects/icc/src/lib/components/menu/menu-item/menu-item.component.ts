import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IccField } from '../../../items';

@Component({
  selector: 'icc-menu-item',
  templateUrl: './menu-item.component.html',
  // styleUrls: ['./menu-item.component.scss'] // WARNING no need here since is use scss-bundle and it can be include here
})
export class IccMenuItemComponent implements OnInit {
  @Input() menuItems: IccField[];

  @Output() iccMenuItemChangedEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor(public router: Router) {
  }

  ngOnInit() { }

  onMenuItemChanged(event) {
    if (!event.disabled) {
      this.iccMenuItemChangedEvent.emit(event);
    }
  }

  onMenuFieldChanged(event, item) {
    this.iccMenuItemChangedEvent.emit(event);
  }
}

