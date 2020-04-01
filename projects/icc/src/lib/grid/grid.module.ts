import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { A11yModule } from '@angular/cdk/a11y';
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';

import { IccDatePickerModule } from '../date-picker/date-picker.module';


// import { GridTableVirtualScrollDirective } from './virtual-scroll/virtual-scroll.directive';
import { IccBaseGridComponent } from './grid.component';
import { IccGridViewComponent } from './view/grid-view.component';

import { IccDataSource } from '../datasource/datasource';

import { IccColumnFilterComponent } from './view/column-filter/column-filter.component';
import { IccColumnFilterDirective } from './view/column-filter/column-filter.directive';
import { IccCheckboxFilterComponent } from './view/column-filter/checkbox/checkbox-filter.component';
import { IccDateFilterComponent } from './view/column-filter/date/date-filter.component';
import { IccNumberFilterComponent } from './view/column-filter/number/number-filter.component';
import { IccSelectFilterComponent } from './view/column-filter/select/select-filter.component';
import { IccTextFilterComponent } from './view/column-filter/text/text-filter.component';


import { IccCellRendererDirective } from './view/cell-renderer/cell-renderer.directive';
import { IccCellRendererComponent } from './view/cell-renderer/cell-renderer.component';
import { IccTextCellRendererComponent } from './view/cell-renderer/text/text-cell-renderer.component';
import { IccDateCellRendererComponent } from './view/cell-renderer/date/date-cell-renderer.component';
import { IccInnerHTMLRendererComponent } from './view/cell-renderer/inner-html/inner-html-cell-renderer.component';
import { IccEditCellRendererComponent } from './view/cell-renderer/edit/edit-cell-renderer.component';
import { IccCheckboxCellRendererComponent } from './view/cell-renderer/checkbox/checkbox-cell-renderer.component';

import { IccCellRendererSliderComponent } from './view/cell-renderer/slider/cell-renderer-slider.component';
import { IccCellRendererBarChartComponent } from './view/cell-renderer/bar-chart/cell-renderer-bar-chart.component';


import { IccEscapeHtmlPipe } from '../pipes/escape_html.pipe';
import { IccLocaleDatePipe } from '../pipes/locale-date.pipe';

import { IccMenuModule } from '../menu/menu.module';
import { IccToolBarModule } from '../tool-bar/tool-bar.module';
import { IccFormModule } from '../form/form.module';
import { IccDialogModule } from '../dialog/dialog.module';
import { IccVirtualScrollModule } from '../directives/virtual-scroll/virtual-scroll.module';

import { IccCellEditComponent } from './view/cell-edit/cell-edit.component';
import { IccCellEditDirective } from './view/cell-edit/cell-edit.directive';
import { IccCellEditCheckboxComponent } from './view/cell-edit/checkbox/cell-edit-checkbox.component';
import { IccCellEditNumberComponent } from './view/cell-edit/number/cell-edit-number.component';
import { IccCellEditRadioComponent } from './view/cell-edit/radio/cell-edit-radio.component';
import { IccCellEditSelectComponent } from './view/cell-edit/select/cell-edit-select.component';
import { IccCellEditTextComponent } from './view/cell-edit/text/cell-edit-text.component';

import { IccInnerHtmlRouteDirective } from './view/inner-html-route.directive';

import { IccCellMenuFormComponent } from './view/cell-menu-form/cell-menu-form.component';

import { IccDataSourceService } from '../services/data-source.service';
import { IccColumnsService } from './services/columns.service';
import { IccColumnResizeDnDService } from './services/column-resize-dnd.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CdkTableModule,
    ScrollingModule,
    A11yModule,
    CdkTreeModule,
    DragDropModule,
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
    MatDatepickerModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSliderModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    IccDatePickerModule,
    IccToolBarModule,
    IccMenuModule,
    IccFormModule,
    IccDialogModule,
    IccVirtualScrollModule
  ],
  declarations: [
    IccBaseGridComponent,
    IccGridViewComponent,
    // GridTableVirtualScrollDirective,
    IccColumnFilterDirective,
    IccColumnFilterComponent,
    IccCheckboxFilterComponent,
    IccDateFilterComponent,
    IccTextFilterComponent,
    IccNumberFilterComponent,
    IccSelectFilterComponent,
    IccCellRendererDirective,
    IccCellRendererComponent,
    IccTextCellRendererComponent,
    IccDateCellRendererComponent,
    IccInnerHTMLRendererComponent,
    IccEditCellRendererComponent,
    IccCheckboxCellRendererComponent,

    IccCellRendererSliderComponent,
    IccCellRendererBarChartComponent,
    IccEscapeHtmlPipe,
    // IccLocaleDatePipe,
    IccCellEditComponent,
    IccCellEditDirective,
    IccCellEditCheckboxComponent,
    IccCellEditNumberComponent,
    IccCellEditRadioComponent,
    IccCellEditSelectComponent,
    IccCellEditTextComponent,
    IccInnerHtmlRouteDirective,
    IccCellMenuFormComponent,
  ],
  exports: [
    IccBaseGridComponent,
    IccGridViewComponent,
    // GridTableVirtualScrollDirective,
    IccColumnFilterDirective,
    IccColumnFilterComponent,
    IccCheckboxFilterComponent,
    IccDateFilterComponent,
    IccTextFilterComponent,
    IccNumberFilterComponent,
    IccSelectFilterComponent,
    IccCellRendererDirective,
    IccCellRendererComponent,
    IccTextCellRendererComponent,
    IccDateCellRendererComponent,
    IccInnerHTMLRendererComponent,
    IccEditCellRendererComponent,
    IccCheckboxCellRendererComponent,

    IccCellRendererSliderComponent,
    IccCellRendererBarChartComponent,
    IccEscapeHtmlPipe,
    // IccLocaleDatePipe,
    IccCellEditComponent,
    IccCellEditDirective,
    IccCellEditCheckboxComponent,
    IccCellEditNumberComponent,
    IccCellEditRadioComponent,
    IccCellEditSelectComponent,
    IccCellEditTextComponent,
    IccInnerHtmlRouteDirective,
    IccCellMenuFormComponent,
  ],
  entryComponents: [
    IccBaseGridComponent,
    IccGridViewComponent,
    IccColumnFilterComponent,
    IccCheckboxFilterComponent,
    IccDateFilterComponent,
    IccTextFilterComponent,
    IccNumberFilterComponent,
    IccSelectFilterComponent,
    IccCellRendererComponent,
    IccTextCellRendererComponent,
    IccDateCellRendererComponent,
    IccInnerHTMLRendererComponent,
    IccEditCellRendererComponent,
    IccCheckboxCellRendererComponent,

    IccCellRendererSliderComponent,
    IccCellRendererBarChartComponent,
    IccCellEditComponent,
    IccCellEditCheckboxComponent,
    IccCellEditRadioComponent,
    IccCellEditNumberComponent,
    IccCellEditSelectComponent,
    IccCellEditTextComponent,
    IccCellMenuFormComponent,
  ],
  providers: [
    // IccDataSource,
    IccDataSourceService,
    IccColumnsService,
    IccColumnResizeDnDService,
    DatePipe,
    IccLocaleDatePipe
  ],
})
export class IccGridModule { }
