export class IccPagination {

  private _offset = 0;
  private _page = 1;
  private _limit = 80; // page size
  private _total = 0;
  private _isScrollPaging = true;

  set isScrollPaging(val: boolean) {
    this._isScrollPaging = val;
  }

  get isScrollPaging(): boolean {
    return this._isScrollPaging;
  }

  set offset(val: number) {
    this._offset = val;
  }

  get offset(): number {
    return this._offset;
  }

  set page(val: number) {
    this._page = val;
  }

  get page(): number {
    return this._page;
  }

  set limit(val: number) {
    this._limit = val;
  }

  get limit(): number {
    return this._limit;
  }

  set total(val: number) {
    this._total = val;
  }

  get total(): number {
    return this._total;
  }

  /*
  // get isPageAtMax(): boolean {
  //   return this.page == Math.ceil(this.total / this.limit);
  // } */

  constructor() { }

  paginationData<T>(data: T[]): T[] {
    const end = this.offset + this.limit;
    return data.slice(this.offset, end);
  }

  setToMaxPage() { // TODO watch bug here
    this.isScrollPaging = false;
    this.page = Math.ceil(this.total / this.limit);
  }

  isLoadNextPage(end: number): boolean {
    if (end > this.page * this.limit) {
      this.offset = this.page * this.limit;
      // console.info(' end =' + end + ' page =' +  this.page  + ' limit =' + this.limit + ' offset =' + this.offset)
      this.page++;
      return true;
    }
  }
}

