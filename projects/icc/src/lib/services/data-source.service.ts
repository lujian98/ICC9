
import { IccInMemoryDataService } from './in-memory/in-memory-data.service';

// IccDataSourceService is same as IccInMemoryDataService
export class IccDataSourceService<T> extends IccInMemoryDataService<T> {}
