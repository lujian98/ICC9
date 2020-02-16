import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { IccField } from '../../items';
import { IccItemFieldService } from '../../items/item_field.service';
import { IccMenuItem } from '../../menu/menu-item';
import { ColumnMenuType, IccColumnConfig, IccGroupHeader } from '../../models';
import { IccUtils } from '../../utils/utils';
import { IccGridConfigs } from '../../models';
import { IccCellEditService } from '../view/cell-edit/cell-edit.service';
import { IccCellRendererService } from '../view/cell-renderer/cell-renderer.service';
import { IccColumnFilterService } from '../view/column-filter/column-filter.service';

@Injectable()
export class IccColumnsService {
  private _isColumnsChanged: boolean;
  private _visibleColumns: IccField[] = [];
  private _displayedColumns: string[];
  private _groupHeaderColumns: IccGroupHeader[] = [];
  private _groupHeaderDisplay: string[];

  set isColumnsChanged(val: boolean) {
    this._isColumnsChanged = val;
  }

  get isColumnsChanged(): boolean {
    return this._isColumnsChanged;
  }

  set visibleColumns(val: IccField[]) {
    this._visibleColumns = val;
  }

  get visibleColumns(): IccField[] {
    return this._visibleColumns;
  }

  set displayedColumns(val: string[]) {
    this._displayedColumns = val;
  }

  get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  set groupHeaderColumns(val: IccGroupHeader[]) {
    this._groupHeaderColumns = val;
  }

  get groupHeaderColumns(): IccGroupHeader[] {
    return this._groupHeaderColumns;
  }

  set groupHeaderDisplay(val: string[]) {
    this._groupHeaderDisplay = val;
  }

  get groupHeaderDisplay(): string[] {
    return this._groupHeaderDisplay;
  }

  constructor(
    private columnService: IccItemFieldService,
    private columnFilterService: IccColumnFilterService,
    private cellRendererService: IccCellRendererService,
    private cellEditService: IccCellEditService,
  ) { }

  public getInitialColumns(columnConfigs: IccColumnConfig[], gridConfigs: IccGridConfigs): IccField[] {
    if (columnConfigs) {
      if (gridConfigs.enableMultiColumnSort) {
        gridConfigs.enableColumnSort = true;
      }
      if (gridConfigs.enableMultiRowGroup) {
        gridConfigs.enableRowGroup = true;
      }
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
          columnConfig.menu = this.setupColumnMenu(columnConfig, gridConfigs);
        }
        if (!columnConfig.priority) {
          columnConfig.priority = 0;
        }
        if (columnConfig.sticky || columnConfig.stickyEnd) { // || columnConfig.groupHeader
          columnConfig.dragDisabled = true;
        }
        const column = this.columnService.getItem(columnConfig);
        if (gridConfigs.enableColumnFilter && this.columnFilterService) {
          column.columnFilter = this.columnFilterService.getColumnFilterByIndex(index, columnConfigs);
        }
        if (this.cellRendererService) {
          column.renderer = this.cellRendererService.getCellRenderByIndex(index, columnConfigs, gridConfigs.enableCellEdit);
        }
        if (gridConfigs.enableCellEdit && this.cellEditService) {
          column.editField = this.cellEditService.getEditFieldByIndex(index, columnConfigs);
        }
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
      width: 50,
      filterField: false,
      fixedWidth: true,
      dragDisabled: true,
      hidden: 'never'
    });
  }

  private setupColumnMenu(columnConfig: IccColumnConfig, gridConfigs: IccGridConfigs): boolean | IccMenuItem {
    let menu: IccMenuItem = {
      children: []
    };
    const columnMenu = columnConfig.menu as IccMenuItem;
    if (columnMenu && columnMenu.children) {
      menu = columnMenu;
    }
    menu.icon = 'fas fa-ellipsis-v';
    if (gridConfigs.enableColumnSort && columnConfig.sortField) {
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
    if (gridConfigs.enableColumnHide && (!columnConfig.hidden || columnConfig.hidden !== 'never')) {
      menu.children.push({
        title: 'Hide Column',
        icon: 'fas fa-times',
        name: ColumnMenuType.HideColumn,
      });
    }
    if (gridConfigs.enableRowGroup && columnConfig.groupField) {
      menu.children.push({
        title: 'Group By this field',
        name: 'groupBy',
      }, {
          title: 'Ungroup',
          name: 'unGroupBy',
          hidden: true,
        });
    }
    if (gridConfigs.enableColumnSticky && columnConfig.stickyable !== false) {
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
    if (menu.children.length > 0) {
      return menu;
    } else {
      return false;
    }
  }

  checkColumnMenus(columns: IccField[]) {
    columns.forEach((column: IccField) => {
      if (column.menu) {
        if (column.sort && column.sort.direction === 'asc') {
          this.setColumnMenuHidden(ColumnMenuType.SortAscending, column);
        } else if (column.sort && column.sort.direction === 'desc') {
          this.setColumnMenuHidden(ColumnMenuType.SortDescending, column);
        } else {
          this.setColumnMenuHidden(ColumnMenuType.RemoveSort, column);
        }
        /*
        if (this.isFitWindowDisabled) {
          if (column.sticky) {
            this.setColumnMenuHidden('pinLeft', column);
          } else if (column.stickyEnd) {
            this.setColumnMenuHidden('pinRight', column);
          } else {
            this.setColumnMenuHidden('unpin', column);
          }
        } else {
          this.setMenuHidden(column, 'pinLeft', true);
          this.setMenuHidden(column, 'pinRight', true);
          this.setMenuHidden(column, 'unpin', true);
        } */
      }
    });
  }

  setColumnMenuHidden(action: string, column: IccField) {
    switch (action) {
      case ColumnMenuType.SortAscending:
        this.setMenuHidden(column, ColumnMenuType.SortAscending, true);
        this.setMenuHidden(column, ColumnMenuType.SortDescending, false);
        this.setMenuHidden(column, ColumnMenuType.RemoveSort, false);
        break;
      case ColumnMenuType.SortDescending:
        this.setMenuHidden(column, ColumnMenuType.SortAscending, false);
        this.setMenuHidden(column, ColumnMenuType.SortDescending, true);
        this.setMenuHidden(column, ColumnMenuType.RemoveSort, false);
        break;
      case ColumnMenuType.RemoveSort:
        this.setMenuHidden(column, ColumnMenuType.SortAscending, false);
        this.setMenuHidden(column, ColumnMenuType.SortDescending, false);
        this.setMenuHidden(column, ColumnMenuType.RemoveSort, true);
        break;
      case 'groupBy':
        this.setMenuHidden(column, 'groupBy', true);
        this.setMenuHidden(column, 'unGroupBy', false);
        break;
      case 'unGroupBy':
        this.setMenuHidden(column, 'groupBy', false);
        this.setMenuHidden(column, 'unGroupBy', true);
        break;
      case 'pinLeft':
        this.setMenuHidden(column, 'pinLeft', true);
        this.setMenuHidden(column, 'pinRight', false);
        this.setMenuHidden(column, 'Unpin', false);
        break;
      case 'pinRight':
        this.setMenuHidden(column, 'pinLeft', false);
        this.setMenuHidden(column, 'pinRight', true);
        this.setMenuHidden(column, 'Unpin', false);
        break;
      case 'unpin':
        this.setMenuHidden(column, 'pinLeft', false);
        this.setMenuHidden(column, 'pinRight', false);
        this.setMenuHidden(column, 'Unpin', true);
        break;
    }
  }

  setMenuHidden(column: IccField, name: string, hidden: boolean) {
    if (column && column.menu) {
      const menus = column.menu as IccMenuItem;
      if (menus && menus.children) {
        const menu = IccUtils.findExactByKey(menus.children, 'name', name);
        if (menu) {
          menu.hidden = hidden;
        }
      }
    }
  }

  public setGridColumView(columns: IccField[], gridConfigs: IccGridConfigs) {
    this.setColumnSticky(columns, gridConfigs);
    this.checkColumnsChanged(columns);
    if (this.isColumnsChanged) {
      this.visibleColumns = [];
      this.groupHeaderColumns = [];
      columns.forEach((column, index) => {
        column.index = index;
        if (!column.hidden && column.itemConfig.hidden !== 'always') {
          this.visibleColumns.push(column);
          this.setGroupHeader(column);
        }
      });
      this.displayedColumns = this.visibleColumns.map(column => column.name);
      const totalVisibleColumns = this.visibleColumns.length;
      this.groupHeaderDisplay = [];
      if (this.groupHeaderColumns.length < totalVisibleColumns) {
        this.groupHeaderDisplay = this.groupHeaderColumns.map(header => header.name);
        this.setGroupHeaderSticky();
      }
    }
  }

  private checkColumnsChanged(columns: IccField[]) {
    const displayedColumns = columns
      .filter(column => !column.hidden && column.itemConfig.hidden !== 'always')
      .map(column => column.name);
    this.isColumnsChanged = JSON.stringify(this.displayedColumns) !== JSON.stringify(displayedColumns);
  }

  private setGroupHeader(column: IccField) {
    let groupHeader: IccGroupHeader = {
      name: `group${column.name}`,
      index: column.index,
      title: column.title,
      colspan: 1
    };
    if (column.groupHeader) {
      const header = this.groupHeaderColumns.filter(item => item.name === column.groupHeader.name);
      if (header.length === 0) {
        groupHeader = column.groupHeader;
        groupHeader.colspan = 1;
        groupHeader.index = column.index; // first grouped header column index
        this.groupHeaderColumns.push(groupHeader);
      } else {
        header[0].colspan++;
      }
    } else {
      this.groupHeaderColumns.push(groupHeader);
    }
  }

  // TODO (1) Sticky right vertical scroll bar width need put into right X ??? unStickyEend issue???
  private setColumnSticky(columns: IccField[], gridConfigs: IccGridConfigs) {
    if (gridConfigs.enableColumnSticky && this.visibleColumns) {
      let stickyPosition = 0;
      let lastStickyIndex = 0;
      columns.forEach(column => {
        if (column.sticky) {
          if (column.index > lastStickyIndex) {
            moveItemInArray(columns, column.index, lastStickyIndex);
          }
          lastStickyIndex++;
          column.left = stickyPosition + 'px';
          if (!column.hidden && column.itemConfig.hidden !== 'always') {
            stickyPosition += column.width;
          }
        } else {
          column.left = 'auto';
        }
      });
      stickyPosition = 0;
      lastStickyIndex = columns.length - 1;
      columns.slice().reverse().forEach(column => {
        if (column.stickyEnd) {
          if (column.index < lastStickyIndex) {
            moveItemInArray(columns, column.index, lastStickyIndex);
          }
          lastStickyIndex--;
          column.right = stickyPosition + 'px';
          if (!column.hidden && column.itemConfig.hidden !== 'always') {
            stickyPosition += column.width;
          }
        } else {
          column.right = 'auto';
        }
      });
      this.setGroupHeaderSticky();
    }
  }

  columnStickyLeft(column: IccField, columns: IccField[]) {
    columns.filter(item => {
      return item.name === column.name || item.name === 'rowSelection' ||
        (column.groupHeader && item.groupHeader && column.groupHeader.name === item.groupHeader.name);
    })
      .forEach(item => {
        Object.assign(item, {
          sticky: true,
          stickyEnd: false,
          dragDisabled: true
        });
      });
    this.setGroupHeaderSticky();
  }

  columnStickyRight(column: IccField, columns: IccField[]) {
    columns.filter(item => {
      return item.name === column.name ||
        (column.groupHeader && item.groupHeader && column.groupHeader.name === item.groupHeader.name);
    })
      .forEach(item => {
        Object.assign(item, {
          sticky: false,
          stickyEnd: true,
          dragDisabled: true
        });
      });
    this.checkRowSelectionSticky(columns);
    this.setGroupHeaderSticky();
  }

  columnUnSticky(column: IccField, columns: IccField[], viewport: CdkVirtualScrollViewport, matTableRef: ElementRef) {
    if (column.stickyEnd) {
      this.resetColumnLeftBorder(column, viewport, matTableRef);
    }
    columns.filter(item => {
      return item.name === column.name ||
        (column.groupHeader && item.groupHeader && column.groupHeader.name === item.groupHeader.name);
    })
      .forEach((item: IccField) => {
        Object.assign(item, {
          sticky: false,
          stickyEnd: false,
          dragDisabled: item.itemConfig.dragDisabled
        });
      });
    this.checkRowSelectionSticky(columns);
    this.setGroupHeaderSticky();
  }

  private checkRowSelectionSticky(columns: IccField[]) {
    const sticky = columns.filter(item => item.sticky && item.name !== 'rowSelection').length;
    if (sticky === 0) {
      const rowSelection = columns.filter(item => item.name === 'rowSelection');
      if (rowSelection.length > 0) {
        rowSelection[0].sticky = false;
      }
    }
  }

  private setGroupHeaderSticky() {
    this.groupHeaderColumns.forEach(header => {
      const columns = this.visibleColumns.filter(column => {
        const groupname = column.groupHeader ? column.groupHeader.name : `group${column.name}`;
        return header.name === groupname;
      });
      if (columns.length > 0) {
        header.width = 0;
        columns.forEach((column, index) => {
          if (index === 0) {
            Object.assign(header, {
              dragDisabled: column.sticky || column.stickyEnd ? true : column.dragDisabled,
              sticky: column.sticky,
              stickyEnd: column.stickyEnd,
              left: column.left,
              right: column.right
            });
          }
          if (column.groupHeader && column.stickyEnd && index === columns.length - 1) {
            header.right = column.right;
          }
          header.width += column.width;
        });
      }
    });
  }

  // This fix a bug with sticky column is not align when scroll up sometime???
  // ngStyle with 'left': column.left sometime is not apply - angular bug???
  public checkStickyColumns(viewport: CdkVirtualScrollViewport, matTableRef: ElementRef) {
    const stickyColumns = this.visibleColumns.filter(column => column.sticky || column.stickyEnd);
    const stickyEndColumns = this.visibleColumns.filter(column => column.stickyEnd);
    const firstStickyEnd = stickyEndColumns.length > 0 ? stickyEndColumns[0].name : '';
    if (stickyColumns.length > 0) {
      stickyColumns.forEach(column => {
        const cellColumns = Array.from(viewport.elementRef.nativeElement.getElementsByClassName('mat-column-' + column.name));
        cellColumns.forEach((element: HTMLDivElement) => {
          if (column.left !== element.style.left) {
            element.style.left = column.left;   // angular material bug
          }
          if (column.right !== element.style.right) {
            element.style.right = column.right; // angular material bug
          }
          if (column.sticky) {
            if (element.style.position !== 'sticky') {
              element.style.position = 'sticky'; // angular material bug
              element.style.background = 'inherit';
            }
          }
          if (column.stickyEnd) {
            if (element.style.position !== 'sticky') {
              element.style.position = 'sticky'; // angular material bug
            }
            if (firstStickyEnd === column.name) { // Add left border to leftest stickyEnd column
              element.style.borderLeft = '1px solid rgba(0,0,0,.12)';
            } else {
              element.style.borderLeft = '';
            }
          }
        });
      });
      stickyColumns.forEach(column => {
        const headerColumns: HTMLDivElement[] = this.getHeaderColumns(column, matTableRef);
        headerColumns.forEach((element: HTMLDivElement) => {
          if (column.sticky) {
            if (element.style.position !== 'sticky') {
              element.style.position = 'sticky'; // angular material bug only first time pin with first column
              element.style.background = 'inherit';
              element.style.zIndex = '1';
            }
          }
          if (column.stickyEnd) {
            if (element.style.position !== 'sticky') {
              element.style.position = 'sticky'; // angular material bug
            }
            let right = column.right;
            if (this.isVerticalScrollVisible(viewport)) { // make sure the headers are align with table cell with stickyEnd
              right = `${parseInt(right, 10) + 15}px`;
            }
            element.style.right = right;
          }
        });
      });
      if (stickyEndColumns.length > 0) {
        stickyEndColumns.reverse().forEach(column => { // Add left border to leftest stickyEnd column
          const headerColumns: HTMLDivElement[] = this.getHeaderColumns(column, matTableRef);
          headerColumns.forEach((element: HTMLDivElement) => {
            if (column.stickyEnd) {
              if (firstStickyEnd === column.name) {
                element.style.borderLeft = '1px solid rgba(0,0,0,.12)';
              } else {
                element.style.borderLeft = '';
              }
            }
          });
        });
      }
    }
  }

  private isVerticalScrollVisible(viewport: CdkVirtualScrollViewport): boolean {
    if (viewport) {
      const element = viewport.elementRef.nativeElement;
      return element.clientHeight < element.scrollHeight;
    }
  }

  private getHeaderColumns(column: IccField, matTableRef: ElementRef): HTMLDivElement[] {
    const headerColumns: HTMLDivElement[] = Array.from(matTableRef.nativeElement.getElementsByClassName('mat-column-' + column.name));
    let groupColumns: HTMLDivElement[] = [];
    if (column.groupHeader) {
      groupColumns = Array.from(matTableRef.nativeElement.getElementsByClassName('mat-column-' + column.groupHeader.name));
    } else {
      groupColumns = Array.from(matTableRef.nativeElement.getElementsByClassName('mat-column-group' + column.name));
    }
    return [...headerColumns.concat(groupColumns)];
  }

  public resetColumnLeftBorder(column: IccField, viewport: CdkVirtualScrollViewport, matTableRef: ElementRef) {
    if (column.groupHeader) {
      const cols = this.visibleColumns.filter(col => col.groupHeader && col.groupHeader.name === column.groupHeader.name);
      column = cols[0];
    }
    const headerColumns: HTMLDivElement[] = this.getHeaderColumns(column, matTableRef);
    headerColumns.forEach((element: HTMLDivElement) => {
      element.style.borderLeft = '';
    });
    const cellColumns = Array.from(viewport.elementRef.nativeElement.getElementsByClassName('mat-column-' + column.name));
    cellColumns.forEach((element: HTMLDivElement) => {
      element.style.borderLeft = '';
    });
  }

  // service does not destory data with ngOnDestroy
  public resetColumnsData() {
    this.visibleColumns = null;
    this.displayedColumns = null;
    this.groupHeaderColumns = null;
    this.groupHeaderDisplay = null;
  }
}

