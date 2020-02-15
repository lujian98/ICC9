import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[iccInnerHtmlRoute]'
})
export class IccInnerHtmlRouteDirective {
  @Input() value: any;

  constructor(private el: ElementRef, private router: Router) { }

  @HostListener('click', ['$event'])
  public onClick(event) {
    if (event.target.tagName === 'A') {
      const router = event.target.getAttribute('routerLink');
      if (router) {
        // console.log(this.value);
        //const params = event.target.getAttribute('queryParams');

        // console.log( ' router=' + router );
        // console.log(params);
        this.router.navigate([router], { queryParams: { deviceid: this.value}})
          .catch(e => {
            this.router.navigate([this.router.url]);
          });
        event.preventDefault();
      }
    }
  }
}

// , { queryParams: { id: this.value}}
//<a [routerLink]="['class-registration']" [queryParams]="{id: 682}" routerLinkActive="active">Class Registration</a></mat-list-item>

// this.router.navigate( ['authenticate'], { queryParams: { jwt: '123'}});

/*
  public onClick(event) {
    if (event.target.tagName === 'A') {
      const router = event.target.getAttribute('routerLink');
      if (router) {
        console.log(this.value);
        this.router.navigate([router])
          .catch(e => {
            this.router.navigate([this.router.url]);
          });
        event.preventDefault();
      }
    }
  }
}
*/