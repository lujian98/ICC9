import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IccField } from '../../items';

@Component({
  selector: 'icc-menu-item',
  templateUrl: './menu-item.component.html',
  // styleUrls: ['./menu-item.component.scss']
})
export class IccMenuItemComponent implements OnInit {
  @Input() menuItems: IccField[];

  @Output() iccMenuItemChangedEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor(public router: Router) {
    // console.log( ' 99999999999999999999999999 9999999999', this)
  }

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
