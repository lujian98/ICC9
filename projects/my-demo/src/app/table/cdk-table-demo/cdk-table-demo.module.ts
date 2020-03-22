import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccTableModule } from 'icc';
import { CdkTableDemoComponent } from './cdk-table-demo.component';

@NgModule({
  declarations: [
    CdkTableDemoComponent,
  ],
  imports: [
    CommonModule,
    IccTableModule,
  ],
  exports: [
    CdkTableDemoComponent
  ],
  entryComponents: [
  ],
  providers: [],
  bootstrap: []
})
export class CdkTableDemoModule { }
