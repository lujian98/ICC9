import { Observable } from 'rxjs';
import { IccGridState } from '../grid';

export interface IccAbstractStateService {
  getGridStates(gridTableID: string): Observable<IccGridState>;
  onSaveGridStates(gridTableID: string, states: IccGridState): void;
}
