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

  menuItemClick(event, menuItem: IccMenuItem) {
    event.stopPropagation();
    if (!menuItem.disabled) {
      this.iccMenuItemClickEvent.emit(menuItem);
    }
  }
}
