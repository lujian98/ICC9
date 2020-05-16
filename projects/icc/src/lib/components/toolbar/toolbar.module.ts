import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { IccPopoverModule } from '../../directives/popover/popover.module';
import { IccFieldViewModule } from '../../directives/field-view/field-view.module';
import { IccFieldViewService } from '../../directives/field-view/field-view.service';

import { IccToolbarComponent } from './toolbar.component';


@NgModule({
  imports: [
    CommonModule,
    IccPopoverModule,
    IccFieldViewModule,
  ],
  declarations: [
    IccToolbarComponent
  ],
  exports: [
    IccToolbarComponent
  ],
  entryComponents: [
    IccToolbarComponent
  ],
  providers: [
    IccFieldViewService
  ],
})
export class IccToolbarModule { }
