import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table.component';
import { CdkTableDemoComponent } from './cdk-table-demo/cdk-table-demo.component';
import { TreeExampleComponent } from '../tree/tree-example/tree-example.component';
import { PanelExampleComponent } from '../panel/panel-example.component';

const routes: Routes = [
  {
    path: 'table-doc',
    component: TableComponent,
    children: [
      { path: 'cdk-table-demo', component: CdkTableDemoComponent },
      { path: 'icc-tree-example', component: TreeExampleComponent },
      { path: 'panel-example', component: PanelExampleComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule { }
