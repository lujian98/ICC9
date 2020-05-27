import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IccField } from '../../items';
import { IccTableConfigs } from '../../models';
import { IccDataSourceService } from '../../services/data-source.service';
import { IccTableEventService } from '../services/table-event.service';
import { IccFieldConfig } from '../../models/item-config';

@Component({
  selector: 'icc-table-topbar',
  templateUrl: './table-topbar.component.html',
  styleUrls: ['./table-topbar.component.scss'],
})
export class IccTableTopbarComponent<T> implements OnInit, OnChanges, OnDestroy {
  @Input() columns: IccField[] = [];
  @Input() tableConfigs: IccTableConfigs;

  private viewport: CdkVirtualScrollViewport;

  alive = true;
  totalRecords = 0;
  tableViewSummary: string;
  menuItems: IccFieldConfig;

  constructor(
    private dataSourceService: IccDataSourceService<T>,
    private tableEventService: IccTableEventService
  ) { }

  ngOnInit() {
    this.tableEventService.tableEvent$.pipe(takeWhile(() => this.alive))
      .subscribe((e: any) => {
        if (e.event) {
          if (e.event.viewport) {
            this.setViewport(e.event.viewport);
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setSideMenu();
  }

  private setViewport(viewport: CdkVirtualScrollViewport) {
    if (!this.viewport) {
      this.viewport = viewport;
      this.viewport.scrolledIndexChange.pipe(takeWhile(() => this.alive)).subscribe(index => {
        this.setTableViewSummary();
      });
      this.setTableViewSummary();
    }
  }

  setSideMenu() {
    const sideMenu = [];
    sideMenu.push({ title: 'Refresh', name: 'Refresh', icon: 'fas fa-sync-alt' });
    if (this.tableConfigs.enableColumnFilter) {
      sideMenu.push({ title: 'Clear', name: 'Clear', icon: 'fas fa-times-circle' });
    }
    if (this.tableConfigs.tableType !== 'table') {
      sideMenu.push({ title: 'Expand All', name: 'expandAll', icon: 'fas fa-times-circle' });
      sideMenu.push({ title: 'Collapse All', name: 'collapseAll', icon: 'fas fa-times-circle' });
    }
    this.menuItems = {
      type: 'menu',
      icon: 'fas fa-ellipsis-v',
      children: sideMenu
    };
  }

  onMenuItemChanged(event) {
    this.tableEventService.tableEvent$.next({ event: { menuItem: event } });
  }

  setTableViewSummary() {
    this.tableViewSummary = 'No record found';
    if (this.alive) {
      const range: ListRange = this.getViewportRange();
      this.totalRecords = this.dataSourceService.totalRecords + this.dataSourceService.totalRowGroups;
      if (this.totalRecords > 0) {
        const viewportPageSize = range.end - range.start + 1;
        this.tableViewSummary = 'Page Size: ' + viewportPageSize +
          ' Rows: ' + range.start + ' - ' + range.end + ' of ' + this.totalRecords;
      }
    }
  }

  getViewportRange(): ListRange { // TODO if it is tree cdk-row -> cdk-tree???
    const range = this.viewport.getRenderedRange();
    let end = range.end < this.totalRecords ? range.end : this.totalRecords;
    const vierportRect = this.viewport.elementRef.nativeElement.getBoundingClientRect();
    const viewportRows = this.viewport.elementRef.nativeElement.getElementsByTagName('cdk-row');
    let find = -1;
    if (viewportRows && viewportRows.length > 0) {
      for (let i = viewportRows.length - 1; i > 0; i--) {
        const rect = viewportRows[i].getBoundingClientRect();
        if ((rect.top + rect.height / 2) <= vierportRect.bottom) {
          find = i + 1;
          break;
        }
      }
    }
    if (find > 0) {
      end = range.start + find;
    }
    if (end >= this.totalRecords) {
      end = this.totalRecords;
    }
    let scrollOffset = this.viewport.measureScrollOffset();
    if (scrollOffset < this.tableConfigs.rowHeight) {
      scrollOffset = 0;
    }
    const index = Math.round(scrollOffset / this.tableConfigs.rowHeight);
    const start = Math.max(0, index) + 1;
    return { start, end };
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

