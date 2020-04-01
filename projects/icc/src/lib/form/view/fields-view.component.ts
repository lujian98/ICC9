import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IccField } from '../../items';

@Component({
  selector: 'icc-fields-view',
  templateUrl: './fields-view.component.html',
  styleUrls: ['./fields-view.component.scss']
})
export class IccFieldsViewComponent implements OnInit {
  @Input() field: IccField;
  @Input() formView: FormGroup;

  @Output() iccFieldValueChangedEvent: EventEmitter<object> = new EventEmitter<object>();

  constructor(
  ) { }

  ngOnInit() { }

  onFieldValueChanged<T>(change: any, field: IccField) {
    const control = this.formView.get(field.name);
    control.markAsTouched({ onlySelf: true });
    field.value = change.value;
    this.iccFieldValueChangedEvent.emit(change);
  }
}

