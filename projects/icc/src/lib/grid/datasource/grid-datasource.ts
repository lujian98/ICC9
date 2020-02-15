import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { IccAbstractDataService } from '../../services';

export class IccBaseGridDataSource<T> extends DataSource<T> {
  private recordsSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private visibleData$: Observable<T[]>;
  private _data: T[];
  readonly queryData$: Observable<T[]>;
  public loading$ = this.loadingSubject.asObservable();

  private _dataSourceService: IccAbstractDataService<T>;
  private subDataSourceService: Subscription;

  get data(): T[] {
    return this._data.slice();
  }

  set data(data: T[]) {
    this._data = data;
    this.recordsSubject.next(data);
  }

  get visibleData(): T[] {
    let data: T[];
    this.visibleData$.subscribe(d => (data = d)).unsubscribe();
    return data;
  }

  set viewport(viewport: CdkVirtualScrollViewport) {
    const sliced = combineLatest(
      this.recordsSubject,
      viewport.renderedRangeStream.pipe(startWith({} as ListRange))
    ).pipe(
      map(([data, { start, end }]) =>
        start == null || end == null ? data : data.slice(start, end)
      )
    );
    this.visibleData$ = sliced.pipe(shareReplay(1));
  }

  set dataSourceService(val: IccAbstractDataService<T>) {
    this._dataSourceService = val;
    this.subDataSourceService = this._dataSourceService.dataSourceChanged$
      .subscribe((data: T[]) => this.loadRecords(data));
  }

  get dataSourceService(): IccAbstractDataService<T> {
    return this._dataSourceService;
  }

  constructor(
  ) {
    super();
    this.queryData$ = this.recordsSubject.asObservable();
  }

  loadRecords(data: T[]) {
    this.data = data;
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.visibleData$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.recordsSubject.complete();
    this.loadingSubject.complete();
    if (this.subDataSourceService) {
      this.subDataSourceService.unsubscribe();
    }
  }
}

