import { Component, OnInit } from '@angular/core';
import { ItemNode, FlatTreeNode, IccFieldConfig, IccField, IccOverlayComponentRef,
  IccItemFieldService, IccFieldViewService, IccMenuItemComponent } from 'icc';

import { TooltipDemoComponent } from '../../tooltip-demo/tooltip-demo.component';

import { FoodNode, TREE_DATA } from '../models/tree-data';
import { LEVEL_TREE_DATA } from '../models/level-tree-data';

const MAX_LEVELS = 220; // 2500/3 for 100,000 node
const MAX_NODES_PER_LEVEL = 2;

@Component({
  selector: 'icc-tree-example',
  templateUrl: './tree-example.component.html',
  styleUrls: ['./tree-example.component.scss']
})
export class TreeExampleComponent implements OnInit {

  texttooltip = 'This is a text tooltip.';
  tooltip = TooltipDemoComponent;
  tooltipdata = {
    skills: [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  };


  title = 'nested-tree';
  data: FoodNode[] = TREE_DATA;

  levelTreeData: FlatTreeNode[] = LEVEL_TREE_DATA;

  nestTreeData: ItemNode[] = [];

  columnConfigs: any[] = [{
    name: 'name',
    width: 400,
  },
  {
    name: 'level',
    width: 200,
    menu: true
  },
  {
    name: 'color',
    width: 250,
    menu: true
  },
  {
    name: 'status',
    width: 100,
    menu: true
  }];

  columnConfigs2: any[] = [{
    name: 'name',
    width: 400,
  },
  {
    name: 'level',
    width: 200
  },
  {
    name: 'color',
    width: 250
  },
  {
    name: 'status',
    width: 100
  }];

  testMenuItems: IccFieldConfig =
    {
      icon: 'fas fa-ellipsis-v',
      title: 'Group',
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


  toolbarItemConfig: IccFieldConfig[] = [{
    title: 'Add',
    name: 'add',
  }, {
    title: 'Edit',
    name: 'edit',
  }, {
    type: 'menu',
    fieldConfig: this.testMenuItems
  }];

  menuItems: IccField;
  menuItemComponent = IccMenuItemComponent;

  cMenuItems: any;

  constructor(
  ) { }

  ngOnInit() {
    this.cMenuItems = {
      menuItemConfigs: this.testMenuItems.children
    };


    // console.log('data =', this.data)
    for (let i = 0; i < MAX_LEVELS; i++) {
      this.nestTreeData.push(this.generateNode(0, i));
    }
    // console.log('fffffffffffffffffff this.nestTreeData =', this.nestTreeData)
    // this.data = this.nestTreeData;
  }

  generateNode(level: number, index: number): ItemNode {
    const children: ItemNode[] = [];
    if (level < MAX_NODES_PER_LEVEL) {
      for (let i = 0; i < MAX_NODES_PER_LEVEL; i++) {
        children.push(this.generateNode(level + 1, i));
      }
    }

    if (children.length > 0) {
      return {
        name: 'index ' + index + ' level ' + level,
        children,
      };
    } else {
      return {
        name: 'index ' + index + ' level ' + level
      };
    }


  }

  close() {
    console.log(' template close this.overlayComponentRef')
  }

  onMenuItemChanged(event) {
    console.log( ' ppppppppppppp menu clicked=', event.value.name)
  }

}

