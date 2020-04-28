import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { MatRadioModule } from '@angular/material/radio';

import { LoginModule } from './login/login.module';
import { TreeExampleModule } from './tree/tree-example/tree-example.module';

import { CdkTableDemoModule } from './table/cdk-table-demo/cdk-table-demo.module';
import { TableModule } from './table/table.module';


import { SchoolModule } from './school/school.module';
import { DocDashboardModule } from './dashboard/dashboard.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,

    LoginModule,
    TreeExampleModule,
    CdkTableDemoModule,
    TableModule,
    SchoolModule,
    DocDashboardModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
