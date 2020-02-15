import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'iccEscapeHtml', pure: false })
export class IccEscapeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);

    // return this.sanitizer.bypassSecurityTrustHtml(content);
    // return this.sanitizer.bypassSecurityTrustStyle(content);
    // return this.sanitizer.bypassSecurityTrustScript(content);
    // return this.sanitizer.bypassSecurityTrustUrl(content);
    // return this.sanitizer.bypassSecurityTrustResourceUrl(content);
  }
}
