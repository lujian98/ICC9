import {
  AfterContentInit, AfterViewInit, Component, ChangeDetectionStrategy, ElementRef, HostListener, Input, OnChanges,
  OnInit, SimpleChanges, ViewEncapsulation, ViewChild, ContentChildren, ViewChildren, QueryList, ViewContainerRef
} from '@angular/core';

import { IccPrefixDirective } from './prefix.directive';
import { IccSuffixDirective } from './suffix.directive';


@Component({
  selector: 'icc-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IccFormFieldComponent implements AfterViewInit, AfterContentInit, OnInit, OnChanges {

  @ContentChildren(IccPrefixDirective, { descendants: true }) _prefixChildren: QueryList<IccPrefixDirective>;
  @ContentChildren(IccSuffixDirective, { descendants: true }) _suffixChildren: QueryList<IccSuffixDirective>;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
  }


}

