import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { IccItem, IccSelectType, IccMenuItem, IccGroupHeader, IccColumnConfig, IccGridConfigs } from 'icc';
import { IccBaseGridExampleDataService } from './icc-base-grid-example-data.service';
import { IccCellRendererService, IccCellEditService, IccDataSourceService } from 'icc';



import { Car } from './icc-base-grid-example.datasource';


@Component({
  selector: 'app-icc-base-grid-example',
  templateUrl: './icc-base-grid-example.component.html',
  styleUrls: ['./icc-base-grid-example.component.scss'],
  providers: [
    {
      provide: IccDataSourceService,
      useClass: IccBaseGridExampleDataService
    }
  ]
})
export class IccBaseGridExampleComponent implements OnInit, OnDestroy {

  toolBarItems: IccMenuItem[];
  gridTableID: string = this.constructor.name;
  columnConfigs: IccColumnConfig[];
  data: Car[] = [];
  pageBuffer = 20;



  constructor(
    protected dataSourceService: IccBaseGridExampleDataService,
    protected stateService: IccBaseGridExampleDataService,
    // columnFilterService: IccBaseGridExampleColumnFilterService,
    // cellRendererService: IccCellRendererService,
    // cellEditService: IccCellEditService,
  ) {
  }

  ngOnInit() {
    this.gridTableID = 'icc-base-grid-example-99999999';
    this.pageBuffer = 40;
    const brandFieldType: IccSelectType = {
      type: 'select',
      multiSelect: false,
      filterMultiSelect: true,
      options: [
        { label: '', value: '' },
        { label: 'Audi', value: 'Audi' },
        { label: 'BMW', value: 'BMW' },
        { label: 'Fiat', value: 'Fiat' },
        { label: 'Ford', value: 'Ford' },
        { label: 'Honda', value: 'Honda' },
        { label: 'Jaguar', value: 'Jaguar' },
        { label: 'Mercedes', value: 'Mercedes' },
        { label: 'Renault', value: 'Renault' },
        { label: 'Volvo', value: 'Volvo' },
        { label: 'VW', value: 'VW' },
      ],
    };

    const carGroupHeader: IccGroupHeader = {
      name: 'cargroup',
      title: 'Vehicle Information',
      // titleClass: 'icc-menu warning critical-after',
      align: 'center',
      // dragDisabled: true
    };


    const minValue = 1950;
    this.columnConfigs = [
      {
        name: 'index', title: '#row', type: 'number', sortField: true, filterField: true,
        width: 100,  align: 'center', dragDisabled: false, fixedWidth: true,
        priority: 70, menu: true, // sticky: true,
      },
      {
        name: 'vin', title: 'Vin', type: 'text', sortField: true, filterField: true,
        style: {'background-color': 'lightblue'}, align: 'center', editField: true,
        priority: 40, menu: true,  // sticky: true,
        fixedWidth: 'auto',
        // groupHeader: carGroupHeader,
      },
      {
        name: 'year', title: 'Year', type: { type: 'number', minValue: 1950, maxValue: 2010 },
        sortField: true, filterField: true, menu: true, width: 100,
        // renderer: 'barchart', // barchart slider
        groupField: true, // width: 200, align: 'left', editField: true,
        // titleClass: 'icc-menu warning critical-after',
        // cellReadonly: this.cellReadonly.bind(this),
        priority: 10,  // groupHeader: carGroupHeader,
        validations: [{
          name: 'required',
          validator: Validators.required,
          message: 'Required for recurring schedules.'
        }, {
          name: 'min',
          validator: Validators.min(minValue),
          message: `The min value is ${minValue}.`
        }]
      },
      {
        name: 'brand', title: 'Brand', type: brandFieldType, sortField: true, filterField: true,
        renderer: this.rendererLink.bind(this), groupField: true,
        width: 200,
        // fixedWidth: 'auto',
        editField: true,
        cellReadonly: this.cellReadonly.bind(this), groupHeader: carGroupHeader,
        menu: {
          children: [{
            title: 'test',
            action: 'test'
          }]
        },
        priority: 90,
      },
      {
        name: 'createdate', title: 'Add Date', type: 'date',
        sortField: true,
        filterField: false,
        groupField: true, width: 200,
        fixedWidth: false,
        groupHeader: carGroupHeader,
        align: 'center'
      },
      {
        name: 'color', title: 'Color', type: 'text', width: 250, fixedWidth: false,
        // sortField: 'year', filterField: 'year',
        menu: true, groupField: true,
        // renderer: this.rendererColor.bind(this), groupField: true, editField: true,
        // cellReadonly: this.cellReadonly.bind(this),
        priority: 80, cellMenu: true, // stickyEnd: true,
        // groupHeader: carGroupHeader,
      }
    ];

    this.toolBarItems = [
      { type: 'button', title: 'Add', action: 'Add' },
      { type: 'button', title: 'Activate', action: 'Activate', disabled: true },
      { type: 'button', title: 'Deactivate', action: 'Deactivate', disabled: true },
      { type: 'button', title: 'Edit', action: 'Edit', disabled: true },
      { type: 'button', title: 'Delete', action: 'Delete', disabled: true },
      { type: 'flex-spacer' },
      {
        type: 'menu', title: 'Demo', action: 'Deactivate', disabled: false,
        children: [{
          title: 'Load All Records',
          action: 'loadAllRecords'
        }, {
          title: 'User 3', disabled: true
        }, {
          title: 'User 4'
        }]
      },
      { type: 'button', title: 'RowHeight+', action: 'increaseRowHeight' },
      { type: 'button', title: 'RowHeight-', action: 'decreaseRowHeight' },
      { type: 'button', title: 'Scroll To Index+100', action: 'rowIndex100' },
    ];
    // super.ngOnInit();
  }

  rendererLink<T>(value: T, name: string, column: IccItem, record: T, rowIndex: number, records: T[]): string {
    return `<span style="color:blue"><a routerLink="/outlets">${value}</a></span>`;
  }


  rendererColor<T>(value: T, name: string, column: IccItem, record: T, rowIndex: number, records: T[]): string {
    // console.info( ' wwwwwwwwwwwww rowIndex=' + rowIndex + ' rindex=' + record['index'])
    return '<span style="color:' + value + ';">' + value + '</span>';
  }

  rendererStyle<T>(value: T, name: string, column: IccItem, record: T, rowIndex: number, records: T[]): string {
    const color = (rowIndex % 2) ? 'yellow' : 'blue';
    return '<span style="background-color: ' + color + ';">' + value + '</span>';
  }

  cellReadonly<T>(value: T, name: string, column: IccItem, record: T, rowIndex: number, records: T[]): boolean {
    return (rowIndex % 2) ? true : false;
  }

  ngOnDestroy() {
  }

  /*
  iccCheckGridStates() {
    super.iccCheckGridStates();
    if (this.selection && this.selection.selected) {
      const length = this.selection.selected.length;
      this.toolBarItems[1].disabled = (length > 0) ? false : true;
      this.toolBarItems[2].disabled = (length > 0) ? false : true;
      this.toolBarItems[3].disabled = (length === 1) ? false : true;
      this.toolBarItems[4].disabled = (length === 1) ? false : true;
    }
  }

  onToolBarItemClick(item: IccMenuItem) {
    console.log(item)
    if (item.action === 'loadAllRecords') {
      console.log(item)

      this.pagination.offset = 0;
      this.pagination.limit = 5000;
      this.pending = true;
      this.resetDataSourceService();
      this.dataSourceService.queuedData = [];
      this.fetchRecords();
    } else if (item.action === 'increaseRowHeight') {
      this.rowHeight++;
    } else if (item.action === 'decreaseRowHeight') {
      this.rowHeight--;
      if (this.rowHeight < 20) {
        this.rowHeight = 20;
      }
    } else if (item.action === 'rowIndex100') {
      const range = this.gridView.viewport.getRenderedRange();
      const scrollToIndex = range.start + 101;
      this.gridView.viewport.scrollToIndex(scrollToIndex, 'smooth');
    }
  }

  openOverlay(event: any) {
    super.openOverlay(event, 'baseexampleform');
  } */
}

/*
      let data = document.getElementById('contentToConvert');
      console.log(data);
      html2canvas(data).then(canvas => {
        // Few necessary setting options
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        pdf.save('MYPdf.pdf'); // Generated PDF
      });
      */
