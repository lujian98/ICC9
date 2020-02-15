import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { IccFormFieldService } from './view/fields/form-field.service';
import { IccAbstractDataService } from '../services';
import { IccMenuItem } from '../menu/menu-item';
import { IccUtils } from '../utils/utils';

import { IccFieldConfig } from '../models';
import { IccField } from '../items';
import { IccItemFactory } from '../items';
import { IccFormViewComponent } from './view/form-view.component';

@Component({
  template: '',
})
export class IccFormComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IccFormViewComponent) public form: IccFormViewComponent;

  private _isFormDirty: boolean;
  private _isFormValid: boolean;

  set isFormDirty(val: boolean) {
    this._isFormDirty = val;
  }

  get isFormDirty(): boolean {
    return this._isFormDirty;
  }

  set isFormValid(val: boolean) {
    this._isFormValid = val;
  }

  get isFormValid(): boolean {
    return this._isFormValid;
  }

  protected formFieldService: IccFormFieldService;
  protected dataSourceService: IccAbstractDataService<T>;

  dataKeyId = 'deviceid';
  dataKeyValue: number | string = 0;
  fieldConfigs: IccFieldConfig[];
  fields: IccField[];
  formRawData: {};

  parent: any;

  config: any; // cell-menu form
  record: {};  // cell-menu form

  omittedFields: any[]; // not sure for this now

  toolBarItems: IccMenuItem[] = [];

  private subToolBarItemClick: Subscription;
  private subDetailDataSourceChanged: Subscription;
  private subFieldValueChanged: Subscription;

  constructor() { }

  ngOnInit() {
    if (this.config) {
      if (this.config.record) {
        this.record = this.config.record;
        this.dataKeyValue = this.record[this.dataKeyId];
      }
      if (this.config.parent) {
        this.parent = this.config.parent;
      }
    }
    this.form.isEditing = true;  // TODO edit is true

    this.initialFields();
    this.setToolBarItem();

    this.subDetailDataSourceChanged = this.dataSourceService.detailDataSourceChanged$
      .subscribe((data: T) => this.loadDetailData(data));
    if (this.dataKeyValue && this.dataKeyValue > 0) {
      this.dataSourceService.getDetailData(this.dataKeyId, this.dataKeyValue);
    }
  }

  protected getIccItemFactory(): IccItemFactory {
    return new IccItemFactory(); // this will allow Field Factory be override or extended.
  }

  protected initialFields() {
    this.formRawData = {};
    if (this.fieldConfigs && this.formFieldService) {
      const factory = this.getIccItemFactory();
      this.fields = this.setFieldConfig(this.fieldConfigs, factory);
    }
    console.log(this.formRawData);
  }

  protected setToolBarItem() {
    this.toolBarItems.push(
      { type: 'button', title: 'Apply', action: 'Apply', disabled: true },
      { type: 'button', title: 'Reset', action: 'Reset', disabled: true },
      { type: 'button', title: 'Cancel', action: 'Cancel', disabled: false },
    );
  }

  protected setFieldConfig(fieldConfigs: IccFieldConfig[], factory: IccItemFactory): IccField[] {
    return fieldConfigs.map((config: IccFieldConfig, index) => {
      if (!config.index && config.index !== 0) {
        config.index = index;
      }
      if (!config.type) {
        config.type = 'text';
      }
      if (!config.width) {
        config.width = 250;
      }
      if (!config.align) {
        config.align = 'center';
      }
      const field = factory.getItem(config);
      if (field.itemtype === 'fieldset') {
        field.children = this.setFieldConfig(field.children, factory);
      } else {
        field.editField = this.formFieldService.getFormField(index, config);
        let value = '';
        if (field.value) {
          value = field.value;
        } else if (field.defaultValue) {
          value = field.defaultValue;
        } else if (field.itemtype === 'date') {
          value = new Date().toISOString();
        }
        field.setInitialValue(value);
        this.formRawData[field.field] = field.value;
      }
      return field;
    });
  }

  protected loadDetailData(data: T) {
    this.setDetailData(this.fields, data);
    this.formViewReset();
  }

  private setDetailData(fields: IccField[], data: T) {
    fields.forEach(field => {
      if (field.itemtype === 'fieldset') {
        this.setDetailData(field.children, data);
      } else {
        field.setInitialValue(data[field.name]);
        this.formRawData[field.name] = field.value;
      }
    });
    console.log(this.formRawData);
  }

  ngAfterViewInit() {
    if (this.form) {
      if (this.form.iccToolBarItemClickEvent) {
        this.subToolBarItemClick = this.form.iccToolBarItemClickEvent
          .subscribe((item: any) => this.iccToolBarItemClick(item));
      }
      if (this.form.iccFieldValueChangedEvent) {
        this.subFieldValueChanged = this.form.iccFieldValueChangedEvent
          .subscribe((value: any) => this.iccFieldValueChangedEvent(value));
      }
    }
  }

  protected resetForm() {
    this.resetFieldValue(this.fields);
    this.formViewReset();
  }

  private resetFieldValue(fields: IccField[]) {
    fields.forEach(field => {
      if (field.itemtype === 'fieldset') {
        this.resetFieldValue(field.children);
      } else {
        field.value = field.orgValue;
      }
    });
  }

  protected formViewReset() {
    this.form.formView.reset(this.formRawData);
    this.isFormDirty = false;
    this.isFormValid = this.form.formView.valid;
    this.resetToolBarItems();
  }

  iccToolBarItemClick(item) {
    switch (item.action) {
      case 'Reset':
        this.resetForm();
        break;
      case 'Cancel':
        if (this.parent && this.parent.closeOverlay) {
          this.parent.closeOverlay(item);
        }
        break;
      case 'Apply':
        this.updateService();
        break;
      default:
        break;
    }
  }

  protected updateService() {
    const updateData = this.getFormatFormValues(this.form.formView.value);
    // console.log(updateData)
    this.dataSourceService.onUpdateData(this.dataKeyId, this.dataKeyValue, updateData)
      .subscribe(data => {
        if (data && data[this.dataKeyId] && data[this.dataKeyId] > 0) {
          this.dataKeyValue = data[this.dataKeyId];
          this.dataSourceService.getDetailData(this.dataKeyId, this.dataKeyValue);
          if (this.parent && this.parent.gridRefresh) {
            this.parent.selectRowUpdated(data);
            this.parent.gridRefresh();
          }
        }
      }, (error) => {
      });
  }

  protected getFormatFormValues(formData: object): object {
    formData = this.getFormatFieldValue(this.fields, formData);
    return this.cleanFormData(formData);
  }

  private getFormatFieldValue(fields: IccField[], formData: object): object {
    fields.forEach(field => {
      if (field.itemtype === 'fieldset') {
        formData = this.getFormatFieldValue(field.children, formData);
      } else if (formData[field.name]) {
        if (field.isValueChanged || field.name === this.dataKeyId || !formData[this.dataKeyId]) {
          let value = formData[field.name];
          const type = field.itemtype;
          if (type === 'date') {
            value = (value instanceof Date) ? value : new Date(value);
            value = value.toISOString();
          }
          formData[field.name] = value;
        } else {
          delete formData[field.name];
        }
      }
    });
    return formData;
  }

  protected cleanFormData(data: object): object {
    return data;
  }

  iccFieldValueChangedEvent(change: any) {
    const field = change.field;
    let value = field.value;
    if (field.itemtype === 'date') {
      value = field.getFormatedDate(value);
    }
    this.setFieldValue(field, value);
    this.isFormDirty = this.isFieldsChanged(this.fields);
    this.isFormValid = this.form.formView.valid;
    this.resetToolBarItems();
  }

  isFieldsChanged(fields: IccField[]): boolean {
    const changed = fields.filter(field => {
      if (field.itemtype === 'fieldset') {
        return this.isFieldsChanged(field.children);
      } else {
        return field.isValueChanged;
      }
    });
    return changed.length > 0;
  }

  resetToolBarItems() {
    const apply = this.getToolBarItem('Apply');
    if (apply) {
      apply.disabled = (this.isFormDirty && this.isFormValid) ? false : true;
    }

    const reset = this.getToolBarItem('Reset');
    if (reset) {
      reset.disabled = this.isFormDirty ? false : true;
    }
  }

  getToolBarItem(action: string) {
    return IccUtils.findExactByKey(this.toolBarItems, 'action', action);
  }

  getField(name: string): IccField {
    return this.findField(this.fields, name);
  }

  findField(fields: IccField[], name: string): IccField {
    return fields.reduce((field1: IccField, field2: IccField) => {
      return this.findObject(field1, name) || this.findObject(field2, name);
    });
  }

  protected findObject(field: IccField, name: string): IccField {
    if (field && field.name && field.name === name) {
      return field;
    }
    if (field && field.children && field.children.length > 0) {
      const fields = field.children;
      return this.findField(fields, name);
    }
  }

  setValue(name: string, value: any) {
    const field = this.getField(name);
    if (field) {
      this.setFieldValue(field, value);
    }
  }

  setFieldValue(field: IccField, value: any) {
    if (this.form && this.form.formView) {
      this.form.setValue(field, value);
    }
  }

  setHidden(name: string, hidden: boolean) {
    const field = this.getField(name);
    if (field) {
      this.setFieldHidden(field, hidden);
    }
  }

  setFieldHidden(field: IccField, hidden: boolean) {
    if (field && field.children) {
      field.children.forEach((item: IccField) => {
        this.setFieldHidden(item, hidden);
      });
    }
    field.hidden = hidden;
  }

  setReadonly(name: string, readonly: boolean) {
    const field = this.getField(name);
    if (field) {
      this.setFieldReadonly(field, readonly);
    }
  }

  setFieldReadonly(field: IccField, readonly: boolean) {
    if (field && field.children) {
      field.children.forEach((item: IccField) => {
        this.setFieldReadonly(item, readonly);
      });
    }
    field.readonly = readonly;
  }

  setDisable(name: string, disabled: boolean) {
    const field = this.getField(name);
    if (field) {
      this.setFieldDisable(field, disabled);
    }
  }

  setFieldDisable(field: IccField, disabled: boolean) {
    setTimeout(() => {
      if (this.form && this.form.formView) {
        this.form.setDisable(field, disabled);
      }
    }, 10);
  }

  ngOnDestroy() {
    if (this.subToolBarItemClick) {
      this.subToolBarItemClick.unsubscribe();
    }
    if (this.subFieldValueChanged) {
      this.subFieldValueChanged.unsubscribe();
    }
    if (this.subDetailDataSourceChanged) {
      this.subDetailDataSourceChanged.unsubscribe();
    }
  }
}

