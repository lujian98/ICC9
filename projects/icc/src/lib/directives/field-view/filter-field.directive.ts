import {
  ComponentFactoryResolver,
  // ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IccField } from '../../items';
import { IccDataSource } from '../../datasource/datasource';

@Directive({
  selector: '[iccFilterField]'
})
export class IccFilterFieldDirective<T> implements OnInit, OnChanges, OnDestroy {
  @Input() field: IccField;
  @Input() dataSource: IccDataSource<T>;
  @Input() filteredValues = {};

  componentRef: any;

  private sub: Subscription;

  @Output() iccFilterFieldChangedEvent: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && changes.field.firstChange) {
      const field = changes.field.currentValue;
      if (field.filterField) {
        const factory = this.resolver.resolveComponentFactory(field.filterField);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.field = this.field;
        this.componentRef.instance.dataSource = this.dataSource;
        this.sub = this.componentRef.instance.isFieldValueChanged$
          .subscribe((v: T) => this.iccFilterFieldChangedEvent.emit(v));
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

