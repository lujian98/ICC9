import { Component, OnInit } from '@angular/core';
import { IccColumnConfig  } from 'icc';
import { Vehicle } from '../models/vehicle-model';
import { VehicleData } from '../models/vehicle-data';
import { IccDataSourceService, IccInMemoryDataService } from 'icc';

@Component({
  selector: 'icc-cdk-table-demo',
  templateUrl: './cdk-table-demo.component.html',
  styleUrls: ['./cdk-table-demo.component.scss'],
})
export class CdkTableDemoComponent implements OnInit {

  title = 'cdk table';

  columnConfigs: IccColumnConfig[] = [
    { name: 'vin', title: 'Vin', menu: true },
    { name: 'year', title: 'Year', type: 'number', menu: true },
    { name: 'brand', title: 'Brand', menu: true },
    { name: 'color', title: 'Color', menu: true }
  ];
  data: Vehicle[] = VehicleData;

  ngOnInit() { }
}

