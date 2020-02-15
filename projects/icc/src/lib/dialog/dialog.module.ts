import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { IccDialogComponent } from './dialog.component';
import { IccConfirmationComponent } from './confirmation.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  declarations: [
    IccDialogComponent,
    IccConfirmationComponent
  ],
  exports: [
    IccDialogComponent,
    IccConfirmationComponent
  ],
  entryComponents: [
    IccDialogComponent,
    IccConfirmationComponent
  ]
})
export class IccDialogModule {}

