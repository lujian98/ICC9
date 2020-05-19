import {
  AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, ElementRef,
  OnChanges, OnInit, QueryList, SimpleChanges, ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import { IccLabelDirective } from './label.directive';
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

  @ContentChild(IccLabelDirective) _labelChildNonStatic: IccLabelDirective;
  @ContentChild(IccLabelDirective, { static: true }) _labelChildStatic: IccLabelDirective;
  get _labelChild() {
    return this._labelChildNonStatic || this._labelChildStatic;
  }

  @ContentChildren(IccPrefixDirective, { descendants: true }) _prefixChildren: QueryList<IccPrefixDirective>;
  @ContentChildren(IccSuffixDirective, { descendants: true }) _suffixChildren: QueryList<IccSuffixDirective>;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
  }

  _hasLabel() {
    return !!this._labelChild;
  }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
  }


}

