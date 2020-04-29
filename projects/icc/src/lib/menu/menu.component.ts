import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IccItemFieldService } from '../items/item_field.service';
import { IccFieldViewService } from '../directives/field-view/field-view.service';
import { IccField } from '../items';
import { IccFieldConfig } from '../models/item-config';


@Component({
  selector: 'icc-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class IccMenuComponent implements OnChanges {
  constructor(
    private itemService: IccItemFieldService,
    private fieldViewService: IccFieldViewService,
  ) { }
  @Input() menuItemConfig: IccFieldConfig;
  @Output() iccMenuItemChangedEvent: EventEmitter<any> = new EventEmitter();

  menuItems: IccField;

  testMenuItems: IccFieldConfig =
    {
      icon: 'fas fa-ellipsis-v',
      // name: 'close',
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
                  type: 'checkbox'
                }
              ],
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


  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuItemConfig) {
      // this.menuItemConfig = this.testMenuItems;
      this.menuItems = this.getMenuItems(this.menuItemConfig);
    }
  }

  private getMenuItems(configs: IccFieldConfig): IccField {
    if (configs) {
      const menuItems: IccField = this.getMenuItem(configs);
      if (configs.children && configs.children.length > 0) {
        const items = [];
        configs.children.forEach((config: IccFieldConfig) => {
          items.push(this.getMenuItems(config));
        });
        menuItems.children = items;
      }
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

  onMenuItemChanged(menuItem: any) {
    if (!menuItem.disabled) {
      // console.log( ' yyyyyyyyyyyyy click in the menu', menuItem)
      this.iccMenuItemChangedEvent.emit(menuItem);
    }
  }
}

