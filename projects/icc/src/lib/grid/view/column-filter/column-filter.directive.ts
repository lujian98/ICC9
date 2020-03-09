import {
  ComponentFactoryResolver,
  OnDestroy,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IccDataSource } from '../../../datasource/datasource';
import { IccField } from '../../../items';
import { IccSelectField } from '../../../items';

@Directive({
  selector: '[iccColumnFilter]'
})
export class IccColumnFilterDirective<T> implements OnChanges, OnDestroy {
  @Input() rowHeight = 48;
  @Input() column: IccField;
  @Input() dataSource: IccDataSource<T>;
  @Input() filteredValues = {};

  @Output() iccFilterChangedEvent: EventEmitter<T> = new EventEmitter<T>();

  componentRef: any;
  private sub: Subscription;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.column && changes.column.firstChange) {
      this.addFilterComponent(changes);
    } else if (changes.filteredValues) {
      if (this.column.itemtype === 'select') {
        const column = this.column as IccSelectField<T>;
        this.filteredValues[column.name] = this.getSelectionValueChecked(column);
      }
      this.componentRef.instance.filteredValues = this.filteredValues;
    }
  }

  addFilterComponent(changes: SimpleChanges) {
    const column = changes.column.currentValue;
    const type = (typeof column.type === 'string') ? column.type : column.type.type;
    const filter = column.columnFilter;
    const factory = this.resolver.resolveComponentFactory(filter);

    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.filterType = type;
    this.componentRef.instance.rowHeight = this.rowHeight;
    this.componentRef.instance.column = column;
    this.componentRef.instance.dataSource = this.dataSource;
    if (column.itemtype === 'select') {
      this.filteredValues[column.name] = this.getSelectionValueChecked(column);
    }
    this.componentRef.instance.filteredValues = this.filteredValues;
    this.sub = this.componentRef.instance.isFilterChanged$.subscribe((v: T) => this.iccFilterChangedEvent.emit(v));
  }

  private getSelectionValueChecked(column: IccSelectField<T>): any {
    const value = this.filteredValues[column.name];
    if (column.filterMultiSelect && !(value instanceof Array)) {
      if (value && typeof value === 'string') {
        return [value];
      } else {
        return [];
      }
    } else if (!column.filterMultiSelect && value instanceof Array) {
      if (value.length > 0) { // the value indicator may not correct if more than two
        return value[0];
      } else {
        return '';
      }
    }
    return value;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
