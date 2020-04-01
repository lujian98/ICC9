import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IccInMemoryDataService, IccLoadRecordParams } from 'icc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle-model';

@Injectable({
  providedIn: 'root'
})
export class IccCdkTableDemoDataService extends IccInMemoryDataService<Vehicle> {
  dataSourceUrl = './assets/data/cars-large.json';
  dataSourceKey = 'data';

  constructor(
    protected httpClient: HttpClient,
  ) {
    super();
  }

  callRequestService(loadParams: IccLoadRecordParams): Observable<Vehicle[]> {
    if (this.queuedData.length === 0) {
      return this.httpClient.get<Vehicle[]>(this.dataSourceUrl, {})
        .pipe(
          map(response => {
            if (this.dataSourceKey) {
              response = response[this.dataSourceKey];
            }
            this.queuedData = response;
            this.addDataIndex();
            this.totalRecords = this.queuedData.length;
            return this.getProcessedData(this.queuedData, loadParams);
          }),
        );
    } else {
      return super.callRequestService(loadParams);
    }
  }

  private addDataIndex() {
    this.queuedData.forEach((item, index) => {
      item.index = index + 1;
    });
  }

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}

