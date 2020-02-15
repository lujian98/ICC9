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
import { debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { IccBaseGridDataSource } from '../../datasource/grid-datasource';
import { IccField } from '../../../items';
import { IccCellEditData } from './cell-edit.service';

@Directive({
  selector: '[iccCellEdit]'
})
export class IccCellEditDirective<T> implements OnChanges, OnDestroy {
  @Input() rowHeight = 48;
  @Input() column: IccField;
  @Input() dataKeyId: string;
  @Input() field: string;
  @Input() value: T;
  @Input() rowIndex: number;
  @Input() colIndex: number;
  @Input() record: T;
  @Input() dataSource: IccBaseGridDataSource<T>;

  @Output() iccSaveCellEditValueEvent: EventEmitter<IccCellEditData<T>> = new EventEmitter<IccCellEditData<T>>();
  @Output() iccCellEditSpecialKeyEvent: EventEmitter<T> = new EventEmitter<T>();

  componentRef: any;
  private sub: Subscription;
  private subCellEditSpecialKeyEvent: Subscription;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnChanges(changes: SimpleChanges) { // TODO when record changed need update here
    if (changes.column && changes.column.firstChange) {
      this.addCellEditComponent(changes);
    } else if (changes.rowIndex) {
      this.componentRef.instance.rowIndex = changes.rowIndex.currentValue;
    }
    //  console.info( ' record edit changed 888888888888888888888')
    //  console.log(changes)

  }

  addCellEditComponent(changes: SimpleChanges) {
    const column = changes.column.currentValue;
    if (column.editField) {
      const factory = this.resolver.resolveComponentFactory(column.editField);
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.rowHeight = this.rowHeight;
      this.componentRef.instance.column = column;
      this.componentRef.instance.dataKeyId = this.dataKeyId;
      this.componentRef.instance.field = this.field;
      if (column.type === 'select') {
        // this.value = this.getSelectionValueChecked(column, this.value);
        this.value = column.getCheckedValue(this.value);
      }
      this.componentRef.instance.record = this.record;
      this.componentRef.instance.dataSource = this.dataSource;
      this.componentRef.instance.value = this.value;
      this.componentRef.instance.rowIndex = this.rowIndex;
      this.componentRef.instance.colIndex = this.colIndex;
    }
    this.sub = this.componentRef.instance.saveCellEditValue$
      .subscribe((cellData: IccCellEditData<T>) => this.iccSaveCellEditValueEvent.emit(cellData));
    this.subCellEditSpecialKeyEvent = this.componentRef.instance.cellEditSpecialKeyEvent$
      .pipe(
        debounceTime(50), distinctUntilChanged(), share()
      )
      .subscribe((v: T) => this.iccCellEditSpecialKeyEvent.emit(v));
  }

  /*
  // in case the selection mode is not compatable may need as data source service provide correct data format
  getSelectionValueChecked(column: IccSelectColumn<T>, value: any): any {
    if (column.multiSelect && !(value instanceof Array)) {
      if (value && typeof value === 'string') {
        return [value];
      } else {
        return [];
      }
    } else if (!column.multiSelect && value instanceof Array) {
      if (value.length > 0) { // the value indicator may not correct if more than two
        return value[0];
      } else {
        return '';
      }
    }
    return value;
  } */

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subCellEditSpecialKeyEvent) {
      this.subCellEditSpecialKeyEvent.unsubscribe();
    }
  }
}
