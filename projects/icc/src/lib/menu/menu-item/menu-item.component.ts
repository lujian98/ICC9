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

  @Output() iccMenuItemChangedEvent: EventEmitter<IccMenuItem> = new EventEmitter();

  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor(public router: Router) { }

  ngOnInit() { }

  onMenuItemChanged(event) {
    // event.stopPropagation();
    // console.log(' 99999 event', event)
    if (!event.disabled) {
      this.iccMenuItemChangedEvent.emit(event);
    }
  }

  onMenuFieldChanged(event, item) {
    console.log(' 777777777777 event=', event, ' item=', item)
    this.iccMenuItemChangedEvent.emit(event);
  }
}
