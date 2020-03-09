import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccGridModule, IccTreeModule } from 'icc';
import { TreeExampleComponent } from './tree-example.component';

@NgModule({
  declarations: [
    TreeExampleComponent
  ],
  imports: [
    CommonModule,
    IccTreeModule
  ],
  exports: [
    TreeExampleComponent,
  ],
  entryComponents: [
  ],
  providers: [],
  bootstrap: []
})
export class TreeExampleModule { }
