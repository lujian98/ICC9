
import { ItemNode } from 'icc';

export interface FoodNode extends ItemNode {
  color?: string;
  children?: FoodNode[];
}

export const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit23',
    color: 'red',
    children: [
      { name: 'Apple', color: 'red', },
      { name: 'Banana', color: 'red', },
      { name: 'Fruit loops', color: 'red', },
    ]
  }, {
    name: 'Vegetables',
    color: 'green',
    children: [
      {
        name: 'Green',
        color: 'green',
        children: [
          { name: 'Broccoli', color: 'red', },
          { name: 'Brussels sprouts', color: 'red', },
        ]
      }, {
        name: 'Orange',
        color: 'orange',
        children: [
          { name: 'Pumpkins', color: 'red', },
          { name: 'Carrots', color: 'red', },
        ]
      },
    ]
  },
];
