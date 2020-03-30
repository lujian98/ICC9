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
import { SelectionModel } from '@angular/cdk/collections';
import { IccTableViewComponent } from './table-view/table-view.component';
import { IccFlatTreeComponent } from '../tree/flat-tree/flat-tree.component';
import { IccNestedTreeComponent } from '../tree/nested-tree/nested-tree.component';
import { IccTableConfigs } from '../models';
import { IccField } from '../items';

const componentMapper = {
  table: IccTableViewComponent,
  flatTree: IccFlatTreeComponent,
  nestedTree: IccNestedTreeComponent,
};

@Directive({
  selector: '[iccTableView]'
})
export class IccTableViewDirective<T> implements OnInit, OnChanges, OnDestroy {
  @Input() tableConfigs: IccTableConfigs;
  @Input() data: T[] = [];
  @Input() columns: IccField[] = [];
  @Input() selection: SelectionModel<T>;
  @Input() expandAll: boolean;
  @Input() collapseAll: boolean;

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
    this.componentRef.instance.columns = this.columns;
    this.componentRef.instance.data = this.data;
    this.componentRef.instance.tableConfigs = this.tableConfigs;
    this.componentRef.instance.selection = this.selection;
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
  }
}

