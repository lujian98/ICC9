import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IccMenuItem } from './menu-item';
import { IccItemFieldService } from '../items/item_field.service';
import { IccFieldViewService } from '../directives/field-view/field-view.service';
import { IccField } from '../items';

@Component({
  selector: 'icc-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class IccMenuComponent implements OnChanges {
  @Input() menuItemConfig: IccMenuItem;
  @Output() iccMenuItemClickEvent: EventEmitter<IccMenuItem> = new EventEmitter();

  menuItems: IccMenuItem = {};
  constructor(
    private itemService: IccItemFieldService,
    private fieldViewService: IccFieldViewService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuItemConfig) {
      this.menuItems = {};
      console.log( ' this.menuItemConfig=', this.menuItemConfig)
      this.setInitialItems(this.menuItemConfig);
      console.log(' XXXX XXX this.menuItems =', this.menuItems);
    }
  }

  public setInitialItems(menuItemConfig: IccMenuItem) {
    if (menuItemConfig) {
      this.menuItems = this.getMenuItem(menuItemConfig);
      if (menuItemConfig.children && menuItemConfig.children.length > 0) {
        const items = [];
        menuItemConfig.children.forEach((config: IccMenuItem, index) => {
          const item = this.getMenuItem(config);
          item.fieldView = this.fieldViewService.getFieldView(config);
          items.push(item);
        });
        this.menuItems.children = items;
      }
    }
  }

  //           column.columnFilter = this.columnFilterService.getColumnFilterByIndex(index, columnConfigs);


  private getMenuItem(menuItemConfig): IccField {
    if (!menuItemConfig.type) {
      menuItemConfig.type = 'button';
    }
    return this.itemService.getItem(menuItemConfig);
  }

  onMenuItemClick(menuItem: IccMenuItem) {
    if (!menuItem.disabled) {
      this.iccMenuItemClickEvent.emit(menuItem);
    }
  }
}


/* // test menu data
navItems: IccMenuItem =
{
  title: 'AngularMix',
  name: 'close',
  children: [
    {
      title: 'Speakers',
      name: 'group',
      children: [
        {
          title: 'Michael Prentice',
          name: 'person',
          children: [
            {
              title: 'Delight your Organization',
              name: 'star_rate',
            }
          ]
        },
        {
          title: 'Stephen Fluin',
          name: 'person',
          children: [
            {
              title: 'What\'s up with the Web?',
              name: 'star_rate',
            }
          ]
        },
        {
          title: 'Mike Brocchi',
          name: 'person',
          children: [
            {
              title: 'My ally, the CLI',
              name: 'star_rate',
            },
            {
              title: 'Become an Angular Tailor',
              name: 'star_rate',
            }
          ]
        }
      ]
    },
    {
      title: 'Sessions',
      name: 'speaker_notes',
      children: [
        {
          title: 'Delight your Organization',
          name: 'star_rate',
        },
        {
          title: 'What\'s up with the Web?',
          name: 'star_rate',
        },
        {
          title: 'My ally, the CLI',
          name: 'star_rate',
        },
        {
          title: 'Become an Angular Tailor',
          name: 'star_rate',
        }
      ]
    },
    {
      title: 'Feedback',
      name: 'feedback',
    }
  ]
};

*/


