export class IccUtils {
  static dataSortByField<T>(data: T[], field: string, direction: string): T[] {
    const order = direction === 'asc' ? 1 : -1;
    data.sort((d1, d2) => {
      const v1 = d1[field];
      const v2 = d2[field];
      let res = null;
      if (v1 == null && v2 != null) {
        res = -1;
      } else if (v1 != null && v2 == null) {
        res = 1;
      } else if (v1 == null && v2 == null) {
        res = 0;
      } else if (typeof v1 === 'string' && typeof v2 === 'string') {
        res = v1.localeCompare(v2);
      } else {
        res = (v1 < v2) ? -1 : (v1 > v2) ? 1 : 0;
      }
      return (order * res);
    });
    return data;
  }

  static findDataByKey<T>(data: T[], key: string, value: string): T[] {
    const find = data.filter(item => item[key] && item[key] === value);
    return find;
  }

  static findExactByKey<T>(data: T[], key: string, value: string): T {
    const find = this.findDataByKey(data, key, value);
    if (find && find.length > 0) {
      return find[0];
    }
  }

  static countDecimals(value: any) {
    if (value === null || isNaN(value) || Math.floor(value.valueOf()) === value.valueOf()) {
      return 0;
    }
    const arr = value.toString().split('.');
    return arr[1] ? arr[1].length : 0;
  }
}
