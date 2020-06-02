import { Directive, ElementRef, Input, HostBinding, HostListener, EventEmitter, Output } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';


@Directive({
  selector: '[iccActive]'
})
export class IccActiveDirective <T> implements Highlightable {
  @Input('iccActive') item?: T;
  disabled: boolean;
  @Output() selected: EventEmitter<T> = new EventEmitter();

  @HostBinding('tabindex') tabIndex = 0;

  constructor(private element: ElementRef) { }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  @HostListener('click', ['$event'])
  manage(event: KeyboardEvent) {
    this.selected.emit(this.item);
  }

  // getLabel(): string {
  //  return this.label || '';
  // }

  setActiveStyles() {
    console.log('icc active');
    const el = (this.element.nativeElement as HTMLElement);
    el.style.backgroundColor = 'gray';
    this.tabIndex = 0;
    this.element.nativeElement.focus();
  }

  setInactiveStyles() {
    console.log('icc inactive');
    const el = (this.element.nativeElement as HTMLElement);
    el.style.backgroundColor = 'white';
    this.tabIndex = -1;
  }
}

