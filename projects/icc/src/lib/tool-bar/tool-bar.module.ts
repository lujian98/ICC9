import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IccToolBarComponent } from './tool-bar.component';
import { IccMenuModule } from '../menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IccMenuModule
  ],
  declarations: [
    IccToolBarComponent,
  ],
  exports: [
    IccToolBarComponent,
  ],
  entryComponents: [
    IccToolBarComponent,
  ],
  providers: [],
})
export class IccToolBarModule { }
