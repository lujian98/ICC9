import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccFormFieldComponent } from './form-field.component';
import { IccLabelDirective } from './label.directive';
import { IccPrefixDirective } from './prefix.directive';
import { IccSuffixDirective } from './suffix.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IccFormFieldComponent,
    IccLabelDirective,
    IccPrefixDirective,
    IccSuffixDirective
  ],
  exports: [
    IccFormFieldComponent,
    IccLabelDirective,
    IccPrefixDirective,
    IccSuffixDirective
  ]
})
export class IccFormFieldModule { }
