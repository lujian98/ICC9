import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccActiveDirective } from './active.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IccActiveDirective
  ],
  exports: [
    IccActiveDirective
  ]
})
export class IccActiveModule { }
