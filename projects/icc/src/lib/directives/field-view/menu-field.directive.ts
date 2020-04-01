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
import { Subscription } from 'rxjs';
import { IccField } from '../../items';

@Directive({
  selector: '[iccMenuField]'
})
export class IccMenuFieldDirective<T> implements OnInit, OnChanges, OnDestroy {
  @Input() field: IccField;
  componentRef: any;

  private sub: Subscription;

  @Output() iccMenuFieldChangedEvent: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && changes.field.firstChange) {
      const field = changes.field.currentValue;
      if (field.menuField) {
        const factory = this.resolver.resolveComponentFactory(field.menuField);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.field = this.field;
        this.sub = this.componentRef.instance.isFieldValueChanged$
          .subscribe((v: T) => this.iccMenuFieldChangedEvent.emit(v));
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

