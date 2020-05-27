import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccResizeDirective } from './resize.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IccResizeDirective
  ],
  exports: [
    IccResizeDirective
  ]
})
export class IccResizeModule { }
