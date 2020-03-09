import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { IccField } from '../../../items';
import { IccDataSource } from '../../../datasource/datasource';

@Directive({
  selector: '[iccCellRenderer]'
})
export class IccCellRendererDirective<T> implements OnChanges, OnDestroy {
  @Input() rowHeight = 48;
  @Input() column: IccField;
  @Input() dataKeyId: string;
  @Input() field: string;
  @Input() value: T;
  @Input() rowIndex: number;
  @Input() colIndex: number;
  @Input() record: T;
  @Input() dataSource: IccDataSource<T>;

  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.column && changes.column.firstChange) {
      this.addRendererComponent(changes);
    }
  }

  addRendererComponent(changes: SimpleChanges) {
    const column = changes.column.currentValue;
    if (column.renderer) {
      const factory = this.resolver.resolveComponentFactory(column.renderer);
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.rowHeight = this.rowHeight;
      this.componentRef.instance.column = column;
      this.componentRef.instance.dataKeyId = this.dataKeyId;
      this.componentRef.instance.field = this.field;
      this.componentRef.instance.value = this.value;
      this.componentRef.instance.rowIndex = this.rowIndex;
      this.componentRef.instance.colIndex = this.colIndex;
      this.componentRef.instance.record = this.record;
      this.componentRef.instance.dataSource = this.dataSource;
    }
  }

  ngOnDestroy() {
  }
}
