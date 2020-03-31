import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { IccFieldViewDirective } from './field-view.directive';
import { IccFieldFilterDirective } from './field-filter.directive';
import { IccFieldViewComponent } from './field-view.component';
import { IccFieldViewButtonComponent } from './button/field-view-button.component';
import { IccFieldViewCheckboxComponent } from './checkbox/field-view-checkbox.component';
import { IccFieldViewTextComponent } from './text/field-view-text.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  declarations: [
    IccFieldViewDirective,
    IccFieldFilterDirective,
    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent,
    IccFieldViewTextComponent
  ],
  exports: [
    IccFieldViewDirective,
    IccFieldFilterDirective,
    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent,
    IccFieldViewTextComponent
  ]
})
export class IccFieldViewModule { }
