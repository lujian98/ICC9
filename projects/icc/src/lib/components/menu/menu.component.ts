import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IccFieldConfig } from '../../models/item-config';


@Component({
  selector: 'icc-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class IccMenuComponent {
  @Input() menuItemConfig: IccFieldConfig;
  @Output() iccItemChangedEvent: EventEmitter<any> = new EventEmitter();

  constructor(
  ) { }

  testMenuItems: IccFieldConfig =
    {
      icon: 'fas fa-ellipsis-v',
      // name: 'close',    console.log(' 2222222 this.menuItemConfig =', this.menuItemConfigs)

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

  onMenuItemChanged(menuItem: any) {
    if (!menuItem.disabled) {
      this.iccItemChangedEvent.emit(menuItem);
    }
  }
}

