import { NgModule } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { IccPanelModule } from 'icc';

import { SchoolRoutingModule } from './school-routing.module';



import { SchoolComponent } from './school.component';


@NgModule({
  declarations: [
    SchoolComponent,
  ],
  imports: [
    // BrowserModule,
    // BrowserAnimationsModule,
    FormsModule,
    // HttpClientModule,
    IccPanelModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    SchoolRoutingModule,
  ],
  providers: [],
  entryComponents: [
  ],
  bootstrap: [SchoolComponent]
})
export class SchoolModule { }
