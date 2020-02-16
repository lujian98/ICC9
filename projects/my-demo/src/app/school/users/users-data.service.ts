import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IccRansackDataService } from 'icc';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService extends IccRansackDataService<any> {
  dataSourceUrl = '/api/exchange/exchangedata.php';

  dataSourceKey = 'user';
  totalRecordsName = 'totalCounts';

  constructor(
    protected httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  /*
  onUserLogin(username: string, password: string): Observable<any> {
    const url = this.dataSourceUrl + '/userLogin';
    let params = new HttpParams();
    params = this.paramDeviceType(params);
    params = params.append('username', username);
    params = params.append('password', password);
    return this.httpClient.post(url, params)
      .pipe(
        map((data: any) => {
          this.userInfo = data;
          return data;
        })
      );
  } */

}

