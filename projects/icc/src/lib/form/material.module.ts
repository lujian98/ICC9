import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/datepicker/'; TODOv9
import { MatSelectModule } from '@angular/material/select';
// import { MatOptionModule } from '@angular/material/select'; TODOv9
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatSelectModule,
    // MatOptionModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatSelectModule,
    // MatOptionModule,
    MatCheckboxModule,
    MatRadioModule
  ]
})
export class MaterialModule {}
