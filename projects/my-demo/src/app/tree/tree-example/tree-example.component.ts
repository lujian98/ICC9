import { Component, OnInit } from '@angular/core';
import { ItemNode, FlatTreeNode  } from 'icc';

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

  ngOnInit() {

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
}

