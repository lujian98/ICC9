import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IccItemFieldService } from '../../../items/item_field.service';
import { IccFieldViewService } from '../../../directives/field-view/field-view.service';
import { IccField } from '../../../items';
import { IccFieldConfig } from '../../../models/item-config';

@Component({
  selector: 'icc-menu-item',
  templateUrl: './menu-item.component.html',
  // styleUrls: ['./menu-item.component.scss'] // WARNING no need here since is use scss-bundle and it can be include here
})
export class IccMenuItemComponent implements OnInit {
  @Input() menuItemConfigs: IccFieldConfig[];
  @Input() menuItems: IccField[];

  @Output() iccItemChangedEvent: EventEmitter<any> = new EventEmitter();

  // @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor(
    private itemService: IccItemFieldService,
    private fieldViewService: IccFieldViewService,
    public router: Router
  ) {
  }

  ngOnInit() {
    if (this.menuItemConfigs) {
      this.setMenuItems();
    }
  }

  setMenuItems() {
    this.menuItems = this.getMenuItems(this.menuItemConfigs);
  }

  private getMenuItems(configs: IccFieldConfig[]): IccField[] {
    if (configs && configs.length > 0) {
      const menuItems = [];
      configs.forEach((config: IccFieldConfig) => {
        const item: IccField = this.getMenuItem(config);
        if (config.children && config.children.length > 0) {
          item.children = this.getMenuItems(config.children);
        }
        menuItems.push(item);
      });
      return menuItems;
    }
  }

  private getMenuItem(config: IccFieldConfig): IccField {
    if (!config.type) {
      config.type = 'button';
    }
    const item = this.itemService.getItem(config);
    item.menuField = this.fieldViewService.getFieldView(config);
    return item;
  }

  onMenuItemChanged(event) {
    if (!event.disabled) {
      this.iccItemChangedEvent.emit(event);
    }
  }

  onMenuFieldChanged(event, item) {
    this.iccItemChangedEvent.emit(event);
  }
}

