import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IccMenuItem } from '../menu-item';

@Component({
  selector: 'icc-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class IccMenuItemComponent implements OnInit {
  @Input() menuItems: IccMenuItem[];

  @Output() iccMenuItemClickEvent: EventEmitter<IccMenuItem> = new EventEmitter();

  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor(public router: Router) { }

  ngOnInit() { }

  menuItemClick(event) {
    // event.stopPropagation();
    // console.log(' 99999 event', event)
    if (!event.disabled) {
      this.iccMenuItemClickEvent.emit(event);
    }
  }

  onMenuItemClickEvent(event, item) {
    // console.log(' 777777777777 event=', event, ' item=', item)
    this.iccMenuItemClickEvent.emit(event);
  }
}
