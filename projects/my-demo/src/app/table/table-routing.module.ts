import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table.component';
import { CdkTableDemoComponent } from './cdk-table-demo/cdk-table-demo.component';


const routes: Routes = [
  {
    path: 'table-doc',
    component: TableComponent,
    children: [
      { path: 'cdk-table-demo', component: CdkTableDemoComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule { }
