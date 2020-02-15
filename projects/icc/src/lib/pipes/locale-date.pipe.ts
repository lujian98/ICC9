import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { IccLocaleService } from '../date-picker/services/locale.service';

@Pipe({
  name: 'localeDate'
})
export class IccLocaleDatePipe implements PipeTransform {

  constructor(private localeService: IccLocaleService) { }

  transform(value: any, format: string) {
    if (!value) { return ''; }
    if (!format) { format = 'shortDate'; }
    return new DatePipe(this.localeService.locale).transform(value, format);
  }
}
