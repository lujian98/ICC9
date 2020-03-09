import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccVirtualScrollDirective } from './virtual-scroll.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IccVirtualScrollDirective
  ],
  exports: [
    IccVirtualScrollDirective
  ]
})
export class IccVirtualScrollModule { }
