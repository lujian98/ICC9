import { Directive, ElementRef, Input, HostBinding, HostListener, EventEmitter, Output } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';


@Directive({
  selector: '[appNavigableListItem]'
})
export class NavigableListItemDirective implements Highlightable {

  @Input('appNavigableListItem') label?: string;
  disabled: boolean;

  @Output('navSelected') selected = new EventEmitter<void>()

  @HostBinding('tabindex') tabIndex = 0;

  constructor(private element: ElementRef) {
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  @HostListener('click', ['$event'])
  manage(event: KeyboardEvent) {
    this.selected.emit()
  }


  getLabel(): string {
    return this.label || '';
  }

  setActiveStyles() {
    console.log("active")
    const a = (this.element.nativeElement as HTMLElement)
    a.style.backgroundColor = "gray"
    this.tabIndex = 0;
    this.element.nativeElement.focus();
  }

  setInactiveStyles() {
    console.log("inactive")
    const a = (this.element.nativeElement as HTMLElement)
    a.style.backgroundColor = "white"
    this.tabIndex = -1;
  }

}