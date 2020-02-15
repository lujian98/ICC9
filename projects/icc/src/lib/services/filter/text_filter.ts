import { IccFilter } from './filter';
import { IccField } from '../../items';

export class IccTextFilter extends IccFilter {
  constructor(column: IccField, key: string) {
    super(column, key, 'text');
  }
}
