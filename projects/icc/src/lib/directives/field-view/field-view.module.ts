import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { IccFieldViewDirective } from './field-view.directive';
import { IccFieldViewComponent } from './field-view.component';
import { IccFieldViewButtonComponent } from './button/field-view-button.component';
import { IccFieldViewCheckboxComponent } from './checkbox/field-view-checkbox.component';


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
    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent
  ],
  exports: [
    IccFieldViewDirective,
    IccFieldViewComponent,
    IccFieldViewButtonComponent,
    IccFieldViewCheckboxComponent
  ]
})
export class IccFieldViewModule { }
