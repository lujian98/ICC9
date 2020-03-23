import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IccActiveMenuComponent } from './active-menu.component';
import { IccMenuComponent } from './menu/menu.component';
export { IccMenuItem } from './menu-item';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  declarations: [
    IccActiveMenuComponent,
    IccMenuComponent
  ],
  exports: [
    IccActiveMenuComponent,
    IccMenuComponent
  ],
  entryComponents: [
    IccActiveMenuComponent,
    IccMenuComponent
  ],
})
export class IccMenuModule { }
