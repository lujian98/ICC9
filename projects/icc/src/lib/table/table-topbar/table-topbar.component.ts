import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IccField } from '../../items';
import { IccMenuItem } from '../../menu/menu-item';
import { IccTableConfigs } from '../../models';

@Component({
  selector: 'icc-table-topbar',
  templateUrl: './table-topbar.component.html',
  styleUrls: ['./table-topbar.component.scss'],
})
export class IccTableTopbarComponent implements OnChanges {
  @Input() columns: IccField[] = [];
  @Input() tableConfigs: IccTableConfigs;

  menuItems: IccMenuItem;

  @Output() iccMenuItemClickEvent: EventEmitter<IccMenuItem> = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.setSideMenu();
  }

  setSideMenu() {
    const sideMenu = [];
    sideMenu.push({ title: 'Refresh', name: 'Refresh', icon: 'fas fa-sync-alt' });
    if (this.tableConfigs.enableColumnFilter) {
      sideMenu.push({ title: 'Clear', name: 'Clear', icon: 'fas fa-times-circle' });
    }
    if (this.tableConfigs.tableType !== 'table') {
      sideMenu.push({ title: 'Expand All', name: 'expandAll', icon: 'fas fa-times-circle' });
      sideMenu.push({ title: 'Collapse All', name: 'collapseAll', icon: 'fas fa-times-circle' });
    }
    this.menuItems = {
      type: 'menu',
      icon: 'fas fa-ellipsis-v',
      children: sideMenu
    };
  }

  onMenuItemClick(event) {
    this.iccMenuItemClickEvent.emit(event);
  }
}

