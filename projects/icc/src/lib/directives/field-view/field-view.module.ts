import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';


import { IccMenuFieldDirective } from './menu-field.directive';
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
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  declarations: [
    IccMenuFieldDirective,
    IccFilterFieldDirective,
    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent,
    IccFieldViewTextComponent
  ],
  exports: [
    IccMenuFieldDirective,
    IccFilterFieldDirective,

    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent,
    IccFieldViewTextComponent
  ]
})
export class IccFieldViewModule { }
