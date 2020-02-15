import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'icc-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class IccConfirmationComponent implements OnInit {
  config: any;
  toolBarItems: any[] = [];

  ngOnInit() {
    if (this.config && this.config.action) {
      const action = this.config.action;
      this.toolBarItems.push(
        { title: action, action },
        { title: 'Cancel', action: 'Cancel' });
    } else {
      this.toolBarItems.push({ title: 'OK', action: 'OK' });
    }
  }

  onToolBarItemClick(item: any) {
    if (item.action === this.config.action && this.config.accepted) {
      this.config.accepted();
    }
  }
}

