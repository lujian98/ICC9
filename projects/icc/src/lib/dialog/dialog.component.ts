import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'icc-dialog-component',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class IccDialogComponent implements OnInit, OnDestroy { // OnChanges, AfterViewInit,
  @ViewChild('target', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  componentRef: ComponentRef<any>;

  toolBarItems: any[];

  constructor(
    public dialogRef: MatDialogRef<IccDialogComponent>,
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(this.data.component);
    this.componentRef = this.viewContainerRef.createComponent(factory);
    this.componentRef.instance.config = this.data.config;
    setTimeout(() => {
      this.toolBarItems = this.componentRef.instance.toolBarItems;
    }, 10);
  }

  onToolBarItemClick(item: any) {
    this.componentRef.instance.iccToolBarItemClick(item);
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}

