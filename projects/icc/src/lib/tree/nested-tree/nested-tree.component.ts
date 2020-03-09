import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { ItemNode } from '../../models';
import { IccBaseTreeComponent } from '../base-tree.component';

@Component({
  selector: 'icc-nested-tree',
  templateUrl: './nested-tree.component.html',
  styleUrls: ['./nested-tree.component.scss', '../tree.component.scss'],
})
export class IccNestedTreeComponent extends IccBaseTreeComponent<ItemNode> implements AfterViewInit {
  treeControl = new NestedTreeControl<ItemNode>(node => node.children);
  nodeId = 100000;
  constructor(
    @Inject(DOCUMENT) document: Document
  ) {
    super();
    this.document = document;
  }

  ngAfterViewInit() {
    this.setTreeColumns();
  }

  protected setTreeData() {
    this.checkColumnWidth();
    this.setDragDrop();
    // this.dataSourceLength = this.getDataLength(this.data, 0); // Don't need this for nested tree
    this.dataSourceLength = this.data.length;
    this.dataSource.data = [...this.data];
  }

  protected setDragDrop() {
    this.nodeLookup = {};
    this.setNodeLookup(this.data, -1);
  }

  hasChild = (_: number, node: ItemNode) => !!node.children && node.children.length > 0;

  nodeExpandCollapse(node: ItemNode) {
    node.isExpanded = !node.isExpanded;
    this.dataSource.data = []; // WARNING need this to refresh the tree node ???
    this.setTreeData();
  }

  expandAll() {
    this.expandNodes(this.data, true);
    this.setTreeData();
  }

  collapseAll() {
    this.expandNodes(this.data, false);
    this.setTreeData();
  }

  private expandNodes(nodes, expand) {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        node.isExpanded = expand;
        if (node.isExpanded) {
          this.treeControl.expand(node);
        } else {
          this.treeControl.collapse(node);
        }
        this.expandNodes(node.children, expand);
      }
    });
  }

  // below is drag and drop
  protected setNodeLookup(nodes: ItemNode[], level: number) {
    level++;
    nodes.forEach(node => {
      this.nodeId++;
      node.nodeId = `icc-tree-node-${this.nodeId}`;
      node.level = level;
      node.status = 'test';
      this.nodeLookup[node.nodeId] = node;
      if (node.children) {
        this.setNodeLookup(node.children, level);
      }
    });
  }

  protected isNodeDroppable(targetId: string): boolean {
    let droppable = true;
    if (targetId === this.dragNode.nodeId) {
      droppable = false;
    } else if (this.dragNode.children) {
      const find = this.findByKeyValue(this.dragNode.children, 'nodeId', targetId);
      if (find) {
        droppable = false;
      }
    }
    return droppable;
  }

  protected findByKeyValue(data: ItemNode[], key: string, value: string): any { // TODO shared utils???
    for (const item of data) {
      if (item[key] && item[key] === value) {
        return item;
      }
      if (item.children) {
        const result = this.findByKeyValue(item.children, key, value);
        if (result) {
          return result;
        }
      }
    }
  }

  protected getParentNodeId(child: ItemNode, nodesToSearch: ItemNode[], parentId: string): string {
    const nodeId = child.nodeId;
    for (const node of nodesToSearch) {
      if (node.nodeId === nodeId) {
        return parentId;
      }
      if (node.children) {
        const ret = this.getParentNodeId(child, node.children, node.nodeId);
        if (ret) {
          return ret;
        }
      }
    }
    return null;
  }

  protected isDroppablePosition(targetId: string, position: string): boolean {
    const targetTree = this.getTreeNodes(this.data, targetId);
    let targetIndex = targetTree.findIndex(c => c.nodeId === targetId);
    const dragIndex = targetTree.findIndex(c => c.nodeId === this.dragNode.nodeId);
    if (position === 'after') {
      targetIndex += 1;
    } else {
      targetIndex -= 1;
    }
    return dragIndex !== targetIndex;
  }

  protected getTreeNodes(nodes: ItemNode[], nodeId: string): ItemNode[] {
    const node = this.nodeLookup[nodeId];
    const parentId = this.getParentNodeId(node, nodes, 'main');
    return parentId !== 'main' ? this.nodeLookup[parentId].children : nodes;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.isPointerOverContainer && this.dropInfo) {
      const draggedItem = this.nodeLookup[this.dragNode.nodeId];
      const draggedTree = this.getTreeNodes(this.data, this.dragNode.nodeId);
      const targetTree = this.getTreeNodes(this.data, this.dropInfo.targetId);
      const prevIndex = draggedTree.findIndex(c => c.nodeId === this.dragNode.nodeId);
      draggedTree.splice(prevIndex, 1);
      switch (this.dropInfo.position) {
        case 'before':
        case 'after':
          const targetIndex = targetTree.findIndex(c => c.nodeId === this.dropInfo.targetId);
          if (this.dropInfo.position === 'before') {
            targetTree.splice(targetIndex, 0, draggedItem);
          } else {
            targetTree.splice(targetIndex + 1, 0, draggedItem);
          }
          break;
        case 'inside':
          const targetNode = this.nodeLookup[this.dropInfo.targetId];
          if (!targetNode.children) {
            targetNode.children = [];
          }
          // targetNode.children.push(draggedItem); // insert at the end
          targetNode.children.splice(0, 0, draggedItem); // insert at begining
          this.treeControl.expand(targetNode);
          targetNode.isExpanded = true;
          break;
      }
    }
    super.drop(event);
  }
}

