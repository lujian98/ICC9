import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  title = 'Grid Demo';

  constructor(
  ) {
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
}

