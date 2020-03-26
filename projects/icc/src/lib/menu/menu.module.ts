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

import { IccFieldViewModule } from '../directives/field-view/field-view.module';
import { IccFieldViewService } from '../directives/field-view/field-view.service';


import { IccActiveMenuComponent } from './active-menu.component';
import { IccMenuComponent } from './menu.component';
import { IccMenuItemComponent } from './menu-item/menu-item.component';
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
    IccFieldViewModule,
  ],
  declarations: [
    IccActiveMenuComponent,
    IccMenuComponent,
    IccMenuItemComponent
  ],
  exports: [
    IccActiveMenuComponent,
    IccMenuComponent,
    IccMenuItemComponent
  ],
  entryComponents: [
    IccActiveMenuComponent,
    IccMenuComponent,
    IccMenuItemComponent
  ],
  providers: [
    IccFieldViewService
  ],
})
export class IccMenuModule { }
