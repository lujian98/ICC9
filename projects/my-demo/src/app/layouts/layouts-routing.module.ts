import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsComponent } from './layouts.component';
import { PanelExampleComponent } from '../panel/panel-example.component';
import { DocDatePickerComponent } from '../components/date-picker/date-picker.component';

const routes: Routes = [
  {
    path: 'layouts',
    component: LayoutsComponent,
    children: [
      { path: 'panel-example', component: PanelExampleComponent },
      { path: 'Date-Picker', component: DocDatePickerComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
