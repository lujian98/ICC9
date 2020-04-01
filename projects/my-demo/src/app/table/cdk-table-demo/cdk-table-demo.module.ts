import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccTableModule } from 'icc';
import { CdkTableDemoComponent } from './cdk-table-demo.component';
import { IccCdkTableDemoDataService } from './cdk-table-demo-data.service';

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
  providers: [IccCdkTableDemoDataService],
  bootstrap: []
})
export class CdkTableDemoModule { }
