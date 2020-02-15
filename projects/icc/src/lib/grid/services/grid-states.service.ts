import { Injectable } from '@angular/core';

export interface IccGrid2States {
  offset?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IccGridStatesService<T> {

  private _states: IccGrid2States = {};

  set states(val: IccGrid2States) {
    this._states = val;
    // this.stateSubject.next(val);
  }

  get states(): IccGrid2States {
    return this._states;
  }

  constructor() { }

}

/*
  private _states: IccGrid2States = {};

  private stateSubject = new BehaviorSubject<IccGrid2States>(this._states);
  private state$ = this.stateSubject.asObservable();

  offset$ = this.state$.pipe(map(state => state.offset), distinctUntilChanged());
  limit$ = this.state$.pipe(map(state => state.limit), distinctUntilChanged());
  gstarts$ = this.state$.pipe(map(states => states), distinctUntilChanged());

  gridState$: Observable<IccGrid2States> = combineLatest(this.offset$, this.limit$, this.gstarts$).pipe(
    switchMap(([offset, limit, states]) => {
      return of({ offset, limit, states });
    })
  );
  */

