import {
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import { IccFlatTreeComponent } from './flat-tree/flat-tree.component';
import { IccNestedTreeComponent } from './nested-tree/nested-tree.component';
import { IccGridConfigs } from '../models';

const componentMapper = {
  flatTree: IccFlatTreeComponent,
  nestedTree: IccNestedTreeComponent,
};

@Directive({
  selector: '[icc-tree-view]'
})
export class IccTreeViewDirective<T> implements OnInit, OnChanges, OnDestroy {
  @Input() treeType: string;
  @Input() data: T[] = [];
  @Input() gridConfigs: IccGridConfigs;
  @Input() columnConfigs: any[] = [];
  @Input() expandAll: boolean;
  @Input() collapseAll: boolean;

  componentRef: any;
  private sub: Subscription;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.treeType]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.data = this.data;
    this.componentRef.instance.gridConfigs = this.gridConfigs;
    this.componentRef.instance.columnConfigs = this.columnConfigs;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.componentRef) {
      if (changes.expandAll) {
        this.componentRef.instance.expandAll();
      } else if (changes.collapseAll) {
        this.componentRef.instance.collapseAll();
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
