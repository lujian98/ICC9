import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/*
import {
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatProgressBarModule,

  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,

  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material'; */

import { IccGridModule } from 'icc';
import { IccFormModule } from 'icc';
import { IccBaseGridExampleDataService } from './icc-base-grid-example-data.service';
import { IccBaseGridExampleComponent } from './icc-base-grid-example.component';

import { IccColumnFilterService } from 'icc';


import { IccCellRendererService, IccCellEditService,  } from 'icc';

import { IccMenuModule, IccDialogModule } from 'icc';
import { IccToolBarModule } from 'icc';

@NgModule({
  declarations: [
    IccBaseGridExampleComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IccGridModule,
    IccFormModule,
    IccMenuModule,
    IccToolBarModule,
    IccDialogModule,
  ],
  exports: [
    IccBaseGridExampleComponent,
  ],
  entryComponents: [
  ],
  providers: [
    IccBaseGridExampleDataService,
    IccCellRendererService,
    IccCellEditService,
  ],
})
export class IccBaseGridExampleModule {}
