// import { IccBaseGridComponent } from './grid.component';

export interface IccColumnState {
  field: string;
  index: number;
  width: number;
  hidden: boolean | string;
}

export interface IccSortState {
  key: string;
  direction: string;
}

export interface IccFilterPair {
  field: string;
  value: any;
}

export interface IccGridState {
  columns: IccColumnState[];
  sorts: IccSortState[];
  filters: IccFilterPair[];
  selected?: [];
}

export class IccGridStates {

}



