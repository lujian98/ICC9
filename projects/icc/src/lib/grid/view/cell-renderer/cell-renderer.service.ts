import { Injectable } from '@angular/core';
import { IccColumnConfig, IccRendererType } from '../../../models';
import { IccCellRendererBarChartComponent } from './bar-chart/cell-renderer-bar-chart.component';
import { IccCheckboxCellRendererComponent } from './checkbox/checkbox-cell-renderer.component';
import { IccDateCellRendererComponent } from './date/date-cell-renderer.component';
import { IccEditCellRendererComponent } from './edit/edit-cell-renderer.component';
import { IccInnerHTMLRendererComponent } from './inner-html/inner-html-cell-renderer.component';
import { IccCellRendererSliderComponent } from './slider/cell-renderer-slider.component';
import { IccTextCellRendererComponent } from './text/text-cell-renderer.component';




@Injectable({
  providedIn: 'root'
})
export class IccCellRendererService {
  componentMapper = {
    text: IccTextCellRendererComponent,
    date: IccDateCellRendererComponent,
    innerHTML: IccInnerHTMLRendererComponent,
    edit: IccEditCellRendererComponent,
    checkbox: IccCheckboxCellRendererComponent,
    slider: IccCellRendererSliderComponent,
    barchart: IccCellRendererBarChartComponent,
  };

  getColumnFilters() {
    return this.componentMapper;
  }

  getCellRenderByIndex(index: number, columnConfigs: IccColumnConfig[], enableCellEdit: boolean): IccRendererType {
    const columnConfig = columnConfigs[index];
    let renderer = columnConfig.renderer;
    if (columnConfig.editField && enableCellEdit) { // TODO check read only
      renderer = 'edit';
    } else if (typeof columnConfig.renderer === 'function') {
      renderer = 'innerHTML';
    } else if (columnConfig.type === 'checkbox') {
      renderer = 'checkbox';
    } else if (columnConfig.type === 'date') {
      renderer = 'date';
    } else {
      renderer = 'text';
    }
    renderer = this.componentMapper[renderer];
    return renderer;
  }
}
