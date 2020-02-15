import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolComponent } from './school.component';

import { AuthGuardService } from '../services/auth/auth-guard.service';

import { IccBaseGridExampleComponent } from '../table/icc-base-grid-example/icc-base-grid-example.component';



const routes: Routes = [
  {
    path: 'school',
    component: SchoolComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'users', pathMatch: 'full'
            },
            {
        path: '*',
        redirectTo: 'users', pathMatch: 'full'
            },
      { path: 'icc-base-grid-example', component: IccBaseGridExampleComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }