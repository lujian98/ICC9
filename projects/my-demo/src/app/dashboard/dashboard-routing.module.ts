import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocDashboardComponent } from './dashboard.component';



const routes: Routes = [
  {
    path: 'dashboard-doc',
    component: DocDashboardComponent,
    children: [
      /*
      { path: 'nested-tree', component: DocNestedTreeComponent },
      { path: 'flat-tree', component: DocFlatTreeComponent },
      { path: 'nested-tree-grid', component: DocNestedTreeGridComponent },
      { path: 'flat-tree-grid', component: DocFlatTreeGridComponent },
      { path: 'flat-tree-nested-data', component: DocFlatTreeNestedDataComponent }, */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocDashboardRoutingModule { }
