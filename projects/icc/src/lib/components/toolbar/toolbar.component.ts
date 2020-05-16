import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IccField } from '../../items';

@Component({
  selector: 'icc-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class IccToolbarComponent implements OnInit {
  @Input() toolbarItems: IccField[];
  @Input() disableClickedItem = false;
  @Output() menuItemClickEvent: EventEmitter<IccField> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  toolbarFieldClickEvent(item: IccField) {
    this.menuItemClickEvent.emit(item);
    if (this.disableClickedItem === true) {
      // item.disabled = true;
      // this.toggleDisableOnNonClickedItems(item);
    }
  }

  /*
  toggleDisableOnNonClickedItems(item) {
    this.toolbarItems.forEach(toolbarItem => {
      // if (! _.isEqual(item, toolBarItem)) {
      toolbarItem.disabled = false;
      // }
    });
  } */
}
