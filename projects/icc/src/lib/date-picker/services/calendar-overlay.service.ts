import { Overlay } from '@angular/cdk/overlay';
import { Component, Injectable, Injector } from '@angular/core';
import { IccOverlayService } from '../../services/overlay/overlay.service';
import { IccDatePickerOverlayComponent } from '../picker-overlay/date-picker-overlay.component';
import { IccDateRangePickerOverlayComponent } from '../picker-overlay/date-range-picker-overlay.component';


@Injectable()
export class IccCalendarOverlayService<T> extends IccOverlayService<T> {

  componentMapper = {
    datepicker: IccDatePickerOverlayComponent,
    daterangepicker: IccDateRangePickerOverlayComponent,
  };

  constructor(overlay: Overlay, injector: Injector) {
    super(overlay, injector);
  }

  getPortalComponent(portal: string): Component {
    return this.componentMapper[portal];
  }

  // createComponentInstance(configData: {}) { // TODO g et configData
  //  this.componentRef.instance.selectedDate = configData;
  // }

}
