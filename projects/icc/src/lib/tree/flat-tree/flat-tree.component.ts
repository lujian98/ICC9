import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { IccTreeFlattener } from '../../datasource/tree-flattener';
import { FlatTreeNode, ItemNode } from '../../models';
import { IccBaseTreeComponent } from '../base-tree.component';
import { IccTableEventService } from '../../table/services/table-event.service';

@Component({
  selector: 'icc-flat-tree',
  templateUrl: './flat-tree.component.html',
  styleUrls: ['./flat-tree.component.scss', '../tree.component.scss'],
})
export class IccFlatTreeComponent extends IccBaseTreeComponent<FlatTreeNode> implements AfterViewInit {
  treeControl = new FlatTreeControl<FlatTreeNode>(node => node.level, node => node.expandable);
  treeFlattener: IccTreeFlattener<ItemNode, FlatTreeNode>;
  nodeId = 200000;

  constructor(
    @Inject(DOCUMENT) document: any,
    protected tableEventService: IccTableEventService,
  ) {
    super();
    this.document = document;
    this.treeFlattener = new IccTreeFlattener(
      this.transformer, node => node.level, node => node.expandable, node => node.children);
  }

  ngAfterViewInit() {
    if (this.tableConfigs && this.tableConfigs.isNestedData) {
      this.data = this.treeFlattener.flattenNodes(this.data);
    }
    this.setTreeColumns();
  }

  protected setTreeData() {
    const nodes = this.data as FlatTreeNode[];
    this.dataSourceLength = this.getDataLength(nodes);
    const treeData = nodes.filter(node => {
      const collapsed = this.isAnyParentCollapsed(node, nodes);
      if (!collapsed) {
        this.nodeId++;
        node.nodeId = `icc-tree-node-${this.nodeId}`;
        return true;
      }
    });
    this.dataSource.data = [...treeData];
    this.treeControl.dataNodes = this.dataSource.data;
    console.log(' this.treeControl=', this.treeControl)
  }

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;

  nodeExpand(node: FlatTreeNode) {
    node.isExpanded = !node.isExpanded;
    this.setTreeData();
  }

  expandAll() {
    this.data.forEach(node => {
      if (node.expandable) {
        node.isExpanded = true;
      }
    });
    this.setTreeData();
  }

  collapseAll() {
    this.data.forEach(node => {
      if (node.expandable) {
        node.isExpanded = false;
      }
    });
    this.setTreeData();
  }

  private getDataLength(nodes: FlatTreeNode[]): number {
    return nodes.filter(node => !this.isAnyParentCollapsed(node, nodes)).length;
  }

  private isAnyParentCollapsed(node: FlatTreeNode, nodes: FlatTreeNode[]): boolean {
    const nodeIndex = nodes.indexOf(node);
    for (let i = nodeIndex; i >= 0; i--) {
      const pnode = nodes[i];
      if (pnode.level === node.level - 1) {
        if (!pnode.isExpanded && node.level > pnode.level) {
          return true;
        }
        if (this.isAnyParentCollapsed(pnode, nodes)) {
          return true;
        }
        return false;
      }
    }
  }

  private getParentNode(node: FlatTreeNode, nodes: FlatTreeNode[]) {
    const nodeIndex = nodes.indexOf(node);
    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (nodes[i].level === node.level - 1) {
        return nodes[i];
      }
    }
    return null;
  }

  getNodeByNodeId(nodeId: string, nodes: FlatTreeNode[]): FlatTreeNode {
    const node = nodes.filter(n => n.nodeId === nodeId);
    return node[0];
  }

  private transformer = (node: ItemNode, level: number) => { // TODO add nodeId???
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  protected isNodeDroppable(targetId: string): boolean {
    let droppable = true;
    if (targetId === this.dragNode.nodeId) {
      droppable = false;
    } else {
      const subTreeNodes = this.getTreeNodes(this.dragNode, this.data);
      if (subTreeNodes.length > 1) {
        const find = subTreeNodes.filter(node => node.nodeId === targetId);
        if (find.length > 0) {
          droppable = false;
        }
      }
    }
    return droppable;
  }

  protected getParentNodeId(node: FlatTreeNode, nodes: FlatTreeNode[], parentId: string): string {
    const parent = this.getParentNode(node, nodes);
    if (parent) {
      parentId = parent.nodeId;
    }
    return parentId;
  }

  private getTreeNodes(node: FlatTreeNode, nodes: FlatTreeNode[]): FlatTreeNode[] {
    const nodeIndex = nodes.indexOf(node);
    const treeNodes: FlatTreeNode[] = [node];
    const level = node ? node.level : 0;
    let i = nodeIndex + 1;
    while (nodes[i] && nodes[i].level > level) {
      treeNodes.push(nodes[i]);
      i++;
    }
    return treeNodes;
  }

  private setDragNodesLevel(nodes: FlatTreeNode[], level: number) {
    let nodeLevel = -1;
    let plusLevel = -1;
    nodes.forEach((node, index) => {
      if (nodeLevel !== node.level) {
        nodeLevel = node.level;
        plusLevel++;
      }
      node.level = level + plusLevel;
    });
  }

  protected isDroppablePosition(targetId: string, position: string): boolean {
    const nodes = this.data;
    const targetNode = this.getNodeByNodeId(targetId, nodes);
    let targetIndex = nodes.indexOf(targetNode);
    const dragNodes = this.getTreeNodes(this.dragNode, nodes);
    const dragIndex = nodes.indexOf(this.dragNode);
    const diff = (dragIndex > targetIndex) ? 0 : dragNodes.length;
    targetIndex -= diff;
    if (position === 'after') {
      const adIndex = this.getAdujstIndex(targetNode, nodes);
      targetIndex += adIndex + 1;
    }
    return dragIndex !== targetIndex;
  }

  private getAdujstIndex(targetNode: FlatTreeNode, nodes: FlatTreeNode[]): number {
    const nodeTree = this.getTreeNodes(targetNode, nodes);
    return nodeTree.length - 1;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.isPointerOverContainer && this.dropInfo) {
      const dragNodes = this.getTreeNodes(this.dragNode, this.data);
      const dragIndex = this.data.indexOf(this.dragNode);
      const parentNode = this.getParentNode(this.dragNode, this.data);
      const targetNode = this.getNodeByNodeId(this.dropInfo.targetId, this.data);
      const targetIndex = this.data.indexOf(targetNode);
      const diff = (dragIndex > targetIndex) ? 0 : dragNodes.length;
      this.data.splice(dragIndex, dragNodes.length);
      switch (this.dropInfo.position) {
        case 'before':
          this.setDragNodesLevel(dragNodes, targetNode.level);
          this.data.splice(targetIndex - diff, 0, ...dragNodes);
          break;
        case 'after':
          this.setDragNodesLevel(dragNodes, targetNode.level);
          const adIndex = this.getAdujstIndex(targetNode, this.data);
          this.data.splice(targetIndex - diff + adIndex + 1, 0, ...dragNodes);
          break;
        case 'inside':
          this.setDragNodesLevel(dragNodes, targetNode.level + 1);
          targetNode.expandable = true;
          targetNode.isExpanded = true;
          this.data.splice(targetIndex - diff + 1, 0, ...dragNodes);
          break;
      }
      const parentTree = this.getTreeNodes(parentNode, this.data);
      if (parentNode && parentTree.length === 1) {
        parentNode.expandable = false;
      }
    }
    super.drop(event);
  }

  // tree node selection
  descendantsAllSelected(node: FlatTreeNode): boolean {
    // const descendants = this.treeControl.getDescendants(node);
    const descendants = this.getDescendants(node);
    return descendants.every(child => this.selection.isSelected(child));
  }

  descendantsPartiallySelected(node: FlatTreeNode): boolean {
    // const descendants = this.treeControl.getDescendants(node);
    const descendants = this.getDescendants(node);
    const result = descendants.some(child => this.selection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  selectionToggle(node: FlatTreeNode): void {
    this.selection.toggle(node);
    // const descendants = this.treeControl.getDescendants(node);
    const descendants = this.getDescendants(node);
    console.log(' descendants=', descendants)
    this.selection.isSelected(node)
      ? this.selection.select(...descendants)
      : this.selection.deselect(...descendants);
    // this._selectedItems = this.selection.selected.map(s => s.item);
  }

  getDescendants(node: FlatTreeNode): FlatTreeNode[] {
    const startIndex = this.data.indexOf(node);
    const results: FlatTreeNode[] = [];
    for (let i = startIndex + 1; i < this.data.length && node.level < this.data[i].level; i++) {
      results.push(this.data[i]);
    }


    return results;
  }
}

/*
  getDescendants(dataNode: T): T[] {
    const startIndex = this.dataNodes.indexOf(dataNode);
    const results: T[] = [];

    // Goes through flattened tree nodes in the `dataNodes` array, and get all descendants.
    // The level of descendants of a tree node must be greater than the level of the given
    // tree node.
    // If we reach a node whose level is equal to the level of the tree node, we hit a sibling.
    // If we reach a node whose level is greater than the level of the tree node, we hit a
    // sibling of an ancestor.
    for (let i = startIndex + 1;
        i < this.dataNodes.length && this.getLevel(dataNode) < this.getLevel(this.dataNodes[i]);
        i++) {
      results.push(this.dataNodes[i]);
    }
    return results;
  }
  */
