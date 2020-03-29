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
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SelectionModel } from '@angular/cdk/collections';
import { IccTableViewComponent } from './table-view/table-view.component';
import { IccFlatTreeComponent } from '../tree/flat-tree/flat-tree.component';
import { IccNestedTreeComponent } from '../tree/nested-tree/nested-tree.component';
import { IccTableConfigs } from '../models';
import { IccField } from '../items';
import { IccDataSourceService } from '../services/data-source.service';

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
  @Input() dataSourceService: IccDataSourceService<T>;
  @Input() selection: SelectionModel<T>;
  @Input() expandAll: boolean;
  @Input() collapseAll: boolean;

  componentRef: any;
  private sub: Subscription;
  @Output() iccViewportEvent: EventEmitter<CdkVirtualScrollViewport> = new EventEmitter<CdkVirtualScrollViewport>();

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
    this.componentRef.instance.dataSourceService = this.dataSourceService;
    this.componentRef.instance.data = this.data;
    this.componentRef.instance.tableConfigs = this.tableConfigs;
    this.componentRef.instance.selection = this.selection;

    this.sub = this.componentRef.instance.iccViewportEvent.subscribe((viewport: CdkVirtualScrollViewport) => {
      this.iccViewportEvent.emit(viewport);
    });
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

