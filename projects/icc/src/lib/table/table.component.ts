import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IccField } from '../items';
import { IccItemFieldService } from '../items/item_field.service';
import { ColumnMenuType, IccColumnConfig, IccTableConfigs } from '../models';
import { IccFieldViewService } from '../directives/field-view/field-view.service';
import { IccFieldConfig } from '../models/item-config';

@Component({
  selector: 'icc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class IccTableComponent<T> implements OnChanges {
  @Input() tableConfigs: IccTableConfigs = {};
  @Input() data: T[] = [];
  @Input() columnConfigs: IccColumnConfig[] = [];
  @Input() height: string;
  @Input() width: string;
  columns: IccField[] = [];

  constructor(
    private elementRef: ElementRef,
    private columnService: IccItemFieldService,
    private fieldViewService: IccFieldViewService,
  ) {
  }

  ngOnInit() {
    this.setTableWidth();
    this.checkTableConfigs();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableConfigs) {
      this.checkTableConfigs();
    }

    if (changes.columnConfigs) {
      this.tableConfigs.enableTableHeader = true;
      if (this.tableConfigs.enableRowSelection) {
        this.setupSelectionColumn(this.columnConfigs);
      }


      this.columns = this.getInitialColumns(this.columnConfigs, this.tableConfigs);

      // this.setGridColumView();
      // this.filters.setFilters(this.columns);
    }
  }

  setTableWidth() {
    // this.width = '900px';
    if(this.width) {
      const el = this.elementRef.nativeElement;
      el.style.width = this.width;
    }
  }

  private checkTableConfigs() {
    if (!this.tableConfigs.tableType) {
      this.tableConfigs.tableType = 'table';
    }
    if (this.tableConfigs.enableTableSideMenu || this.tableConfigs.enableTableViewSummary) {
      this.tableConfigs.enableTableTopbar = true;
    }
    if (!this.tableConfigs.filteredValues) {
      this.tableConfigs.filteredValues = {};
    }
    if (!this.tableConfigs.rowHeight) {
      this.tableConfigs.rowHeight = 30;
    }
    if (this.tableConfigs.enableMultiRowSelection) {
      this.tableConfigs.enableRowSelection = true;
    }
    if (this.tableConfigs.enableMultiColumnSort) {
      this.tableConfigs.enableColumnSort = true;
    }
    if (this.tableConfigs.enableMultiRowGroup) {
      this.tableConfigs.enableRowGroup = true;
    }
    if (this.columnConfigs.length === 0) {
      this.columnConfigs = [{
        name: 'name',
        width: this.tableConfigs.width || 300
      }];
    }
    this.columns = this.getInitialColumns(this.columnConfigs, this.tableConfigs);
  }

  public getInitialColumns(columnConfigs: IccColumnConfig[], tableConfigs: IccTableConfigs): IccField[] {
    if (columnConfigs) {
      const columns = [];
      columnConfigs.forEach((columnConfig: IccColumnConfig, index) => {
        if (!columnConfig.index && columnConfig.index !== 0) {
          columnConfig.index = index;
        }
        if (!columnConfig.align) {
          columnConfig.align = 'center';
        }
        if (!columnConfig.type) {
          columnConfig.type = 'text';
        }
        if (columnConfig.filterField === undefined) {
          // columnConfig.filterField = true;
        }
        if (columnConfig.sortField === undefined) {
          columnConfig.sortField = true;
        }
        if (columnConfig.groupField && !columnConfig.menu) {
          columnConfig.menu = true;
        }
        if (columnConfig.menu) {
          columnConfig.menu = this.getColumnMenu(columnConfig, tableConfigs);
        }
        if (!columnConfig.priority) {
          columnConfig.priority = 0;
        }
        if (columnConfig.sticky || columnConfig.stickyEnd) { // || columnConfig.groupHeader
          columnConfig.dragDisabled = true;
        }
        const column = this.columnService.getItem(columnConfig);
        if (tableConfigs.enableColumnFilter && columnConfig.filterField) {
          column.filterField = this.fieldViewService.getFieldView(columnConfig);
        }

        /*
        if (this.cellRendererService) {
          column.renderer = this.cellRendererService.getCellRenderByIndex(index, columnConfigs, tableConfigs.enableCellEdit);
        }
        if (tableConfigs.enableCellEdit && this.cellEditService) {
          column.editField = this.cellEditService.getEditFieldByIndex(index, columnConfigs);
        } */
        columns.push(column);
      });
      return columns;
    }
  }

  public setupSelectionColumn(columnConfigs: IccColumnConfig[]) {
    columnConfigs.unshift({
      name: 'rowSelection',
      title: '',
      type: 'checkbox',
      align: 'center',
      width: 30, // if 30 need reduce the padding
      filterField: false,
      fixedWidth: true,
      dragDisabled: true,
      hidden: 'never'
    });
  }

  private getColumnMenu(column: any, tableConfigs: IccTableConfigs): IccFieldConfig {
    const menus = [];
    if (tableConfigs.enableColumnSort && column.sortField) {
      menus.push({
        title: 'Sort Ascending',
        icon: 'fas fa-sort-amount-down',
        name: ColumnMenuType.SortAscending,
      }, {
          title: 'Sort Descending',
          icon: 'fas fa-sort-amount-up',
          name: ColumnMenuType.SortDescending,
        }, {
          title: 'Remove Sort',
          icon: 'fas fa-times',
          name: ColumnMenuType.RemoveSort,
        });
    }
    if (tableConfigs.enableRowGroup && column.groupField) {
      menus.push({
        title: 'Group By this field',
        name: 'groupBy',
      }, {
          title: 'Ungroup',
          name: 'unGroupBy',
          hidden: true,
        });
    }
    if (tableConfigs.enableColumnSticky && column.stickyable !== false) {
      menus.push({
        title: 'Pin Left',
        name: 'pinLeft',
        icon: 'fas fa-chevron-left'
      }, {
          title: 'Pin Right',
          name: 'pinRight',
          icon: 'fas fa-chevron-right'
        }, {
          title: 'Unpin',
          name: 'unpin',
          icon: 'fas fa-times'
        });
    }

    const menu: IccFieldConfig = {
      icon: 'fas fa-ellipsis-v',
      children: menus
    };
    // TODO if use input column menu
    return menu;
  }
}

