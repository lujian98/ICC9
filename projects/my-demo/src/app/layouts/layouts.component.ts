import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit, OnDestroy {
  title = 'Grid Demo';

  constructor(
  ) {
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
}

