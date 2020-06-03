import { Directive, ElementRef, Input, HostBinding, HostListener, EventEmitter, Output } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';


@Directive({
  selector: '[iccActive]'
})
export class IccActiveDirective<T> implements Highlightable {
  @Input('iccActive') item?: T;
  disabled: boolean;
  @Output() selected: EventEmitter<T> = new EventEmitter();

  @HostBinding('tabindex') tabIndex = 0;

  constructor(
    private element: ElementRef,
  ) { }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  @HostListener('click', ['$event'])
  manage(event: KeyboardEvent) {
    this.selected.emit(this.item);
  }

  setActiveStyles() {
    this.tabIndex = 0;
    this.element.nativeElement.focus();
    this.element.nativeElement.classList.add('active');
  }

  setInactiveStyles() {
    this.tabIndex = -1;
    this.element.nativeElement.classList.remove('active');
  }
}

