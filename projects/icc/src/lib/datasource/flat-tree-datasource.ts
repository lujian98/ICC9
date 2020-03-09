import { CollectionViewer } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IccDataSource } from './datasource';
import { IccTreeFlattener } from './tree-flattener';

/**
 * Data source for flat tree.
 * The data source need to handle expansion/collapsion of the tree node and change the data feed
 * to `Tree`.
 * The nested tree nodes of type `T` are flattened through `TreeFlattener`, and converted
 * to type `F` for `Tree` to consume.
 */
export class IccFlatTreeDataSource<T, F> extends IccDataSource<F> {
  _treedata: T[];
  _flattenedData = new BehaviorSubject<F[]>([]);
  _expandedData = new BehaviorSubject<F[]>([]);

  get treedata(): T[] {
    return this._treedata;
  }

  set treedata(data: T[]) {
    console.log(' set tree data=', data);
    this._treedata = data;
    this._flattenedData.next(this._treeFlattener.flattenNodes(this.treedata));
    this._treeControl.dataNodes = this._flattenedData.value;
    this.recordsSubject.next(this._flattenedData.value);
  }

  constructor(
    protected viewport: CdkVirtualScrollViewport,
    private _treeControl: FlatTreeControl<F>,
    private _treeFlattener: IccTreeFlattener<T, F>
  ) {
    super(viewport);
  }

  connect(collectionViewer: CollectionViewer): Observable<F[]> {
    const changes = [
      collectionViewer.viewChange,
      this._treeControl.expansionModel.changed,
      this._flattenedData
    ];
    return merge(...changes).pipe(map(() => {
      const range = this.viewport.getRenderedRange();
      console.log( ' ragnge =', range)
      this._expandedData.next(
        this._treeFlattener.expandFlattenedNodes(this._flattenedData.value, this._treeControl));
      const visibleData = this._expandedData.value.slice(range.start, range.end);
      console.log(' eeeee this.visibleData=', visibleData);

      return visibleData;
      // return this.visibleData; data.slice(start, end);
    }));
  }
}

