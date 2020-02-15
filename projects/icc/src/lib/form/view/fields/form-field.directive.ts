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
import { IccField } from '../../../items';

@Directive({
  selector: "[iccFormField]"
})
export class IccFormFieldDirective<T> implements OnInit, OnChanges, OnDestroy {
  @Input() field: IccField;
  @Input() group: FormGroup;
  componentRef: any;

  private sub: Subscription;

  @Output() iccFieldValueChangedEvent: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && changes.field.firstChange) {
      const field = changes.field.currentValue;
      if (field.editField) {
        const factory = this.resolver.resolveComponentFactory(field.editField);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.field = this.field;
        this.componentRef.instance.group = this.group;
        this.sub = this.componentRef.instance.isFieldValueChanged$
          .subscribe((v: T) => this.iccFieldValueChangedEvent.emit(v));
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

