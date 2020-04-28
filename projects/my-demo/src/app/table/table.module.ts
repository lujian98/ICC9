import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { IccTableModule } from 'icc';
import { IccPanelModule } from 'icc';

import { TableComponent } from './table.component';

import { TableRoutingModule } from './table-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    IccTableModule,
    IccPanelModule,
    TableRoutingModule
  ],
  declarations: [
    TableComponent,

  ],
  entryComponents: [
    TableComponent,
  ],
})
export class TableModule { }
