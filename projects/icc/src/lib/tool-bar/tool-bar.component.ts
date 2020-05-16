import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'icc-tool-bar2', // TODO remove this
  templateUrl: './tool-bar.component.html',
  // styleUrls: ['./tool-bar.component.scss']
})
export class IccToolBarComponent implements OnInit {
  @Input() toolBarItems: any[];

  @Output() iccToolBarItemClickEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log( ' tool bar is ok')
  }

  toolBarItemClick(item: any) {
    this.iccToolBarItemClickEvent.emit(item);
  }
}
