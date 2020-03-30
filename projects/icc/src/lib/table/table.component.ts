import { Component, ElementRef, Input, OnChanges, SimpleChanges, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ListRange, SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { ColumnMenuType, IccColumnConfig, IccGroupHeader, IccTableConfigs } from '../models';
import { IccField } from '../items';
import { IccItemFieldService } from '../items/item_field.service';
import { IccDataSource } from '../datasource/datasource';
import { IccDataSourceService } from '../services/data-source.service';
import { IccMenuItem } from '../menu/menu-item';

@Component({
  selector: 'icc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class IccTableComponent<T> implements OnChanges {
  @Input() tableConfigs: IccTableConfigs = {};
  @Input() data: T[] = [];
  @Input() columnConfigs: IccColumnConfig[] = [];

  columns: IccField[] = [];
  viewport: CdkVirtualScrollViewport;
  dataSourceService: IccDataSourceService<T>;
  selection: SelectionModel<T>;

  expandAll: boolean;
  collapseAll: boolean;

  constructor(
    private columnService: IccItemFieldService,
    dataSourceService: IccDataSourceService<T>,
  ) {
    this.dataSourceService = dataSourceService;

  }

  ngOnInit() {
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
        this.selection = new SelectionModel<T>(this.tableConfigs.enableMultiRowSelection, []);
      }


      this.columns = this.getInitialColumns(this.columnConfigs, this.tableConfigs);

      // this.setGridColumView();
      // this.filters.setFilters(this.columns);
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

  expandAllNode() {
    this.expandAll = !this.expandAll;
  }

  onViewportEvent(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
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
          columnConfig.filterField = true;
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
        /*
        if (tableConfigs.enableColumnFilter && this.columnFilterService) {
          column.columnFilter = this.columnFilterService.getColumnFilterByIndex(index, columnConfigs);
        }
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

  private getColumnMenu(column: any, tableConfigs: IccTableConfigs): IccMenuItem {
    const menu: IccMenuItem = {
      children: []
    };
    // TODO if use input column menu
    menu.icon = 'fas fa-ellipsis-v';
    if (tableConfigs.enableColumnSort && column.sortField) {
      menu.children.push({
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
      menu.children.push({
        title: 'Group By this field',
        name: 'groupBy',
      }, {
          title: 'Ungroup',
          name: 'unGroupBy',
          hidden: true,
        });
    }
    if (tableConfigs.enableColumnSticky && column.stickyable !== false) {
      menu.children.push({
        title: 'Pin Left',
        action: 'pinLeft',
        icon: 'fas fa-chevron-left'
      }, {
          title: 'Pin Right',
          action: 'pinRight',
          icon: 'fas fa-chevron-right'
        }, {
          title: 'Unpin',
          action: 'unpin',
          icon: 'fas fa-times'
        });
    }
    return menu;
  }

  onMenuItemClick(event) {
    const field = event.field;
    if (field.name === 'expandAll') {
      this.expandAll = !this.expandAll;
    } else if (field.name === 'collapseAll') {
      this.collapseAll = !this.collapseAll;
    }
  }
}

