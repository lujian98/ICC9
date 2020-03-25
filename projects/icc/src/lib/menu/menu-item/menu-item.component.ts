import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IccMenuItem } from '../menu-item';

@Component({
  selector: 'icc-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class IccMenuItemComponent implements OnInit {
  @Input() menuItems: IccMenuItem[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor(public router: Router) { }

  ngOnInit() { }
}
