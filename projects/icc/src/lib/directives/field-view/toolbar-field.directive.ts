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
  selector: '[iccToolbarField]'
})
export class IccToolbarFieldDirective<T> implements OnInit, OnChanges, OnDestroy {
  @Input() field: IccField;
  @Output() toolbarFieldChangedEvent: EventEmitter<T> = new EventEmitter<T>();

  componentRef: any;
  private sub: Subscription;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && changes.field.firstChange) {
      const field = changes.field.currentValue;
      if (field.toolbarField) {
        const factory = this.resolver.resolveComponentFactory(field.toolbarField);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.field = this.field;
        this.sub = this.componentRef.instance.isFieldValueChanged$
          .subscribe((v: T) => this.toolbarFieldChangedEvent.emit(v));
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

