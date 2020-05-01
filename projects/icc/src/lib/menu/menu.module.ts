import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { IccPopoverModule } from '../popover/popover.module';
import { IccFieldViewModule } from '../directives/field-view/field-view.module';
import { IccFieldViewService } from '../directives/field-view/field-view.service';

import { IccMenuComponent } from './menu.component';

import { IccMenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  imports: [
    CommonModule,
    IccPopoverModule,
    IccFieldViewModule,
  ],
  declarations: [
    IccMenuComponent,
    IccMenuItemComponent
  ],
  exports: [
    IccMenuComponent,
    IccMenuItemComponent
  ],
  entryComponents: [
    IccMenuComponent,
    IccMenuItemComponent
  ],
  providers: [
    IccFieldViewService
  ],
})
export class IccMenuModule { }
