import { Component, OnInit } from '@angular/core';
import { IccColumnConfig  } from 'icc';
import { Vehicle } from '../models/vehicle-model';
import { VehicleData } from '../models/vehicle-data';
import { IccDataSourceService, IccGroupHeader } from 'icc';
import { IccCdkTableDemoDataService } from './cdk-table-demo-data.service';

@Component({
  selector: 'icc-cdk-table-demo',
  templateUrl: './cdk-table-demo.component.html',
  styleUrls: ['./cdk-table-demo.component.scss'],
  providers: [
    {
      provide: IccDataSourceService,
      useClass: IccCdkTableDemoDataService
    }
  ]
})
export class CdkTableDemoComponent implements OnInit {

  title = 'cdk table';

  carGroupHeader: IccGroupHeader = {
    name: 'cargroup',
    title: 'Vehicle Information',
    align: 'center',
  };

  columnConfigs: IccColumnConfig[] = [
    { name: 'index', title: '#row', type: 'number' },
    { name: 'vin', title: 'Vin', menu: true, width: 300 },
    { name: 'year', title: 'Year', type: 'number', width: 300, menu: true, groupHeader: this.carGroupHeader, groupField: true },
    { name: 'brand', title: 'Brand', menu: true, width: 300, groupHeader: this.carGroupHeader, groupField: true },
    { name: 'color', title: 'Color', menu: true, width: 300, groupField: true }
  ];
  data: Vehicle[] = VehicleData;

  ngOnInit() { }
}

/*
  template: `
    <icc-grid-view
      [columnConfigs]="columnConfigs">
    </icc-grid-view>
  `,
  providers: [
    {
      provide: IccDataSourceService,
      useClass: IccDataSourceServiceTableDataService
    }
  ]
      { name: 'index', title: '#row', type: 'number' },
    { name: 'vin', title: 'Vin' },
    { name: 'year', title: 'Year', type: 'number' },
    { name: 'brand', title: 'Brand' },
    { name: 'color', title: 'Color' }
  */
