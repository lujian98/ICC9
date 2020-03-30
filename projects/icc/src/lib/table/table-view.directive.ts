import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { IccField } from '../items';
import { IccTableConfigs } from '../models';
import { IccFlatTreeComponent } from '../tree/flat-tree/flat-tree.component';
import { IccNestedTreeComponent } from '../tree/nested-tree/nested-tree.component';
import { IccTableViewComponent } from './table-view/table-view.component';

const componentMapper = {
  table: IccTableViewComponent,
  flatTree: IccFlatTreeComponent,
  nestedTree: IccNestedTreeComponent,
};

@Directive({
  selector: '[iccTableView]'
})
export class IccTableViewDirective<T> implements OnInit {
  @Input() tableConfigs: IccTableConfigs;
  @Input() data: T[] = [];
  @Input() columns: IccField[] = [];

  componentRef: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.tableConfigs.tableType]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.tableConfigs = this.tableConfigs;
    this.componentRef.instance.columns = this.columns;
    this.componentRef.instance.data = this.data;
  }
}

