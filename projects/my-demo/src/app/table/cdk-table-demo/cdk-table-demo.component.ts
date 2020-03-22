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
    { name: 'vin', title: 'Vin' },
    { name: 'year', title: 'Year', type: 'number' },
    { name: 'brand', title: 'Brand' },
    { name: 'color', title: 'Color' }
  ];
  data: Vehicle[] = VehicleData;

  ngOnInit() { }
}

