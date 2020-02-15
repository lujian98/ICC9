import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IccField } from '../../items';
import { IccValidation } from '../../models';


@Component({
  selector: 'icc-form-view',
  templateUrl: './form-view.component.html',
  // styleUrls: ['./form-view.component.scss']
})
export class IccFormViewComponent implements OnInit {
  @Input() fields: IccField[] = [];

  @Output() iccToolBarItemClickEvent: EventEmitter<object> = new EventEmitter();
  @Output() iccFieldValueChangedEvent: EventEmitter<object> = new EventEmitter<object>();

  formView: FormGroup = this.fb.group({});
  isEditing: boolean;

  get value() {
    return this.formView.value;
  }
  constructor(
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFormControl(this.fields);
  }

  private createFormControl(fields: IccField[]) {
    fields.forEach(field => {
      if (field.itemtype === 'fieldset') {
        this.createFormControl(field.children);
      } else if (field.itemtype === 'multicheckbox') {
        this.formView.addControl(field.name, this.buildFromArrayControls(field));
      } else {
        const control = this.fb.control(field.value, this.bindValidations(field.validations || []));
        this.formView.addControl(field.name, control);
      }
    });
  }

  private buildFromArrayControls(field: any) { // TODO field type select/radio/checkbox??
    const controls = field.options.map(item => this.fb.control(item.selected || false));
    return this.fb.array(controls, this.bindValidations(field.validations || []));
  }

  private bindValidations(validations: IccValidation[]) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => validList.push(valid.validator));
      return Validators.compose(validList);
    }
    return null;
  }

  /*
  private validateAllFormFields(formGroup: FormGroup) { // TODO still need this?
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  } */

  onToolBarItemClick(item) {
    this.iccToolBarItemClickEvent.emit(item);
  }

  onFieldValueChanged(change: any) {
    this.iccFieldValueChangedEvent.emit(change);
  }

  setValue<T>(field: IccField, value: T) {
    const control = this.formView.controls[field.name];
    if (control) {
      control.setValue(value);
    }
  }

  // disable may not needed anymore.
  setDisable(field: IccField, disabled: boolean) {
    const control = this.formView.controls[field.name];
    console.log(control);
    if (control) {
      if (disabled) {
        control.disable();
      } else {
        control.enable();
      }
    }
  }
}

