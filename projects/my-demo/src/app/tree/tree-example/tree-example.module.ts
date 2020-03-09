import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccTableModule, IccTreeModule } from 'icc';
import { TreeExampleComponent } from './tree-example.component';

@NgModule({
  declarations: [
    TreeExampleComponent
  ],
  imports: [
    CommonModule,
    IccTableModule,
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
