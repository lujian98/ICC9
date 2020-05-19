import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccFormFieldComponent } from './form-field.component';
import { IccPrefixDirective } from './prefix.directive';
import { IccSuffixDirective } from './suffix.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IccFormFieldComponent,
    IccPrefixDirective,
    IccSuffixDirective
  ],
  exports: [
    IccFormFieldComponent,
    IccPrefixDirective,
    IccSuffixDirective
  ]
})
export class IccFormFieldModule { }
