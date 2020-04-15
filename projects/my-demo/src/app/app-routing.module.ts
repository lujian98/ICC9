import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'school', loadChildren: './school/school.module#SchoolModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard-doc', loadChildren: './dashboard/dashboard.module#DocDashboardModule',
  },
  { path: 'login', loadChildren: './login/login.module#LoginModule', },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }