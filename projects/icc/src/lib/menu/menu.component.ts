import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IccMenuItem } from './menu-item';

@Component({
  selector: 'icc-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class IccMenuComponent {
  @Input() menuItem: IccMenuItem;
  @Output() iccMenuClickEvent: EventEmitter<IccMenuItem> = new EventEmitter();

  constructor() { }
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


