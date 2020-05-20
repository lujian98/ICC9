import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IccFormFieldModule } from '../../components/form-field/form-field.module';

import { IccMenuFieldDirective } from './menu-field.directive';
import { IccToolbarFieldDirective } from './toolbar-field.directive';
import { IccFilterFieldDirective } from './filter-field.directive';
import { IccFieldViewComponent } from './field-view.component';
import { IccFieldViewButtonComponent } from './button/field-view-button.component';
import { IccFieldViewCheckboxComponent } from './checkbox/field-view-checkbox.component';
import { IccFieldViewTextComponent } from './text/field-view-text.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IccFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  declarations: [
    IccMenuFieldDirective,
    IccToolbarFieldDirective,
    IccFilterFieldDirective,
    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent,
    IccFieldViewTextComponent
  ],
  exports: [
    IccMenuFieldDirective,
    IccToolbarFieldDirective,
    IccFilterFieldDirective,

    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent,
    IccFieldViewTextComponent
  ]
})
export class IccFieldViewModule { }
