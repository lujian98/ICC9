import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IccMenuItem } from '../menu/menu-item';

@Component({
  selector: 'icc-tool-bar',
  templateUrl: './tool-bar.component.html',
  // styleUrls: ['./tool-bar.component.scss']
})
export class IccToolBarComponent implements OnInit {
  @Input() toolBarItems: IccMenuItem[];

  @Output() iccToolBarItemClickEvent: EventEmitter<IccMenuItem> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toolBarItemClick(item: IccMenuItem) {
    this.iccToolBarItemClickEvent.emit(item);
  }
}
