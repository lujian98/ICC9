import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IccToolBarComponent } from './tool-bar.component';
import { IccMenuModule } from '../menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
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
