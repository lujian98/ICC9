import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IccGridState, IccInMemoryDataService, IccLoadRecordParams } from 'icc';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Car } from './icc-base-grid-example.datasource';

@Injectable({
  providedIn: 'root'
})
export class IccBaseGridExampleDataService extends IccInMemoryDataService<Car> {
  dataSourceUrl = './assets/data/cars-large.json';
  dataSourceKey = 'data';
  gridStatesDemo: IccGridState;

  //// saveUrl = 'http://192.168.56.149/grid/outlet.php/';

  saveUrl = 'http://192.168.1.10/angular/exchangedata.php';


  constructor(
    protected httpClient: HttpClient,
  ) {
    super();
  }

  callRequestService(loadParams: IccLoadRecordParams): Observable<Car[]> {
    if (this.queuedData.length === 0) {
      return this.httpClient.get<Car[]>(this.dataSourceUrl, {})
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
        // .subscribe(data => this.setDataSource(data));
    } else {
      return super.callRequestService(loadParams);
    }
  }

  private addDataIndex() {
    this.queuedData.forEach((item, index) => {
      item['index'] = index + 1;
      item['createdate'] = this.randomDate(new Date(1950, 0, 1), new Date());
    });
  }

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  onSaveGridStates(gridTableID: string, states: IccGridState): void {
    console.log('save grid states demo = ' + gridTableID );
    console.log(states);
    this.gridStatesDemo = states;
  }

  getGridStates(gridTableID: string): Observable<IccGridState> {
    if (this.gridStatesDemo) {
      console.log('get grid states demo yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy gridTableID=' + gridTableID);
      console.log(this.gridStatesDemo);
      return of(this.gridStatesDemo);
    } else {
      return super.getGridStates(gridTableID); // return of(null); //
    }
  }

  /*
  onSaveGridStates(gridTableID: string, states: IccGridState): void {
    const url = this.saveUrl + '/saveGridStates';
    let params = new HttpParams();
    params = params.append('devicetype', 'outlet');
    params = params.append('setting', gridTableID.toString());
    params = params.append('value', JSON.stringify(states));
    this.httpClient.post(url, params)
      .pipe(
        map((resp: Response) => {
        }),
      )
      .subscribe(resp => {
      });
  }

  getGridStates(gridTableID: string): Observable<IccGridState> {
    const url =  this.saveUrl + '/getGridStates';
    let params = new HttpParams();
    params = params.append('devicetype', 'outlet');
    params = params.append('setting', gridTableID.toString());
    return this.httpClient.get(url, { params })
      .pipe(
        map((resp: string) => {
          const data = JSON.parse(resp);
          return data;
        })
      );
  }
  */
}
