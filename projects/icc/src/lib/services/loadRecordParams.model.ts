import { IccPagination } from './pagination/pagination';
import { IccSorts } from '../services/sort/sorts';
import { IccFilters } from '../services/filter/filters';
import { IccRowGroups } from '../services/row-group/row-groups';

export interface IccLoadRecordParams {
  pagination?: IccPagination;
  sorts?: IccSorts;
  filters?: IccFilters;
  rowGroups?: IccRowGroups;
  isRefresh?: boolean;
}
