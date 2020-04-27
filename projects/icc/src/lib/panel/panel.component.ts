import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'icc-panel-header',
  template: `<ng-content></ng-content>`
})
export class IccPanelHeaderComponent {}

@Component({
  selector: 'icc-panel-content',
  template: `<ng-content></ng-content>`
})
export class IccPanelContentComponent {}

@Component({
  selector: 'icc-panel-footer',
  template: `<ng-content></ng-content>`
})
export class IccPanelFooterComponent {}

@Component({
  selector: 'icc-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class IccPanelComponent implements AfterViewInit, OnInit {
  @Input() height: string;

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() { // TODO input height default is calc(100vh - 50px) -> 50px is top nav bar height
    const el = this.elementRef.nativeElement;
    el.style.height = 'calc(100vh - 50px)';
  }

  ngAfterViewInit() {
  }
}

