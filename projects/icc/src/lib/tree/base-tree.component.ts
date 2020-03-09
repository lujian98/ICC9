import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, ViewChild } from '@angular/core';
import { IccDataSource } from '../datasource/datasource';
import { DropInfo, IccGridConfigs } from '../models';

@Component({
  template: '',
})
export class IccBaseTreeComponent<T> {
  @Input() data: T[] = [];
  @Input() gridConfigs: IccGridConfigs;
  @Input() columnConfigs: any[] = [];

  nodeId: number; // TODO global unique node id????

  dataSource: IccDataSource<T>;
  dataSourceLength = 0;

  tableWidth = 0;
  treeColumn: any;
  visibleColumns: any[] = [];
  displayedColumns: string[] = [];

  isViewportReady = false;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  doc: any;
  dragNode: T;
  nodeLookup = {};
  dropInfo: DropInfo = null;

  protected setTreeColumns() {
    if (this.columnConfigs.length) {
      this.treeColumn = this.columnConfigs[0];
    } else {
      this.treeColumn = { width: 300 }; // TODO input tree column width
    }
    this.visibleColumns = this.columnConfigs;
    this.displayedColumns = this.visibleColumns.map(column => column.name);
  }

  protected checkColumnWidth() {
    this.tableWidth = this.getTableSize();
  }

  protected getTableSize(): number {
    let width = 0;
    this.visibleColumns.forEach(column => {
        width += column.width;
    });
    return width;
  }

  nextBatch(event) {
    if (!this.isViewportReady) {
      this.isViewportReady = true;
      this.dataSource = new IccDataSource(this.viewport);
      this.setTreeData();
    }
    const treeRows = this.viewport.elementRef.nativeElement.getElementsByTagName('cdk-nested-tree-node');
    console.log(' next batch ange changesevent treeRows.length=', treeRows.length, ' data length =', this.dataSourceLength);
  }

  protected setTreeData() { }

  dragStart(node: T) {
    this.dragNode = node;
  }

  dragMoved(event) {
    // console.log('drag moved=', event);
    this.dropInfo = null;
    const e = this.doc.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('icc-tree-node') ? e : e.closest('.icc-tree-node');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    const targetId = container.getAttribute('tree-node-id');
    if (this.isNodeDroppable(targetId)) {
      this.dropInfo = {
        targetId: targetId
      };
      const targetRect = container.getBoundingClientRect();
      const oneThird = targetRect.height / 3;
      if (event.pointerPosition.y - targetRect.top < oneThird &&
        this.isDroppablePosition(targetId, 'before')) {
        this.dropInfo.position = 'before';
      } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird &&
        this.isDroppablePosition(targetId, 'after')) {
        this.dropInfo.position = 'after';
      } else {
        const dragParentId = this.getParentNodeId(this.dragNode, this.data, 'main');
        if (targetId !== dragParentId) {
          this.dropInfo.position = 'inside';
        }
      }
      if (this.dropInfo.position) {
        this.showDragInfo();
      } else {
        this.clearDragInfo();
        this.dropInfo = null;
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dataSource.data = []; // sometime even is not dropable, the tree will rearrange, bug???
    this.setTreeData();
    this.clearDragInfo(true);
  }

  protected isDroppablePosition(targetId: string, posiiton: string): boolean {
    return false;
  }

  protected isNodeDroppable(targetId: string): boolean {
    return false;
  }

  protected getParentNodeId(node: T, nodes: T[], parentId: string): string {
    return null;
  }

  protected showDragInfo() {
    this.clearDragInfo();
    if (this.dropInfo && this.dropInfo.targetId) {
      this.doc.getElementById(this.dropInfo.targetId)
        .classList.add('icc-tree-drop-' + this.dropInfo.position);
    }
  }

  protected clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropInfo = null;
      this.dragNode = null;
    }
    this.doc
      .querySelectorAll('.icc-tree-drop-before')
      .forEach(element => element.classList.remove('icc-tree-drop-before'));
    this.doc
      .querySelectorAll('.icc-tree-drop-after')
      .forEach(element => element.classList.remove('icc-tree-drop-after'));
    this.doc
      .querySelectorAll('.icc-tree-drop-inside')
      .forEach(element => element.classList.remove('icc-tree-drop-inside'));
  }

  onViewportScroll(event: any) {
    this.gridConfigs.columnHeaderPosition = -event.target.scrollLeft;
  }
}

