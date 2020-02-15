import { Component, OnInit } from '@angular/core';
import { IccFormComponent, IccFormFieldService } from '../../../form';
import { IccField } from '../../../items';
import { IccCellEditData } from '../../view/cell-edit/cell-edit.service';

@Component({
  selector: 'icc-cell-menu-form',
  templateUrl: './cell-menu-form.component.html',
  styleUrls: ['./cell-menu-form.component.scss']

})
export class IccCellMenuFormComponent<T> extends IccFormComponent<T> implements OnInit {
  private field: IccField;

  constructor(
    protected formFieldService: IccFormFieldService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.config) {
      this.dataSourceService = this.config.dataSourceService;
      const column = this.config.column;
      const fieldname = column.name;
      const record = this.config.record;
      const val = record[fieldname];

      this.dataKeyId = this.config.dataKeyId;
      const type = column.itemtype;
      if (type === 'text') {
        this.fieldConfigs = [{
          title: column.title,
          name: fieldname,
          type: 'text',
          value: val,
        }];
      } else if (type === 'radio') {
        this.fieldConfigs = [{
          title: column.title,
          name: fieldname,
          type: {
            type: 'radio',
            options: column.options,
          },
          value: val,
        }];
      }
      super.ngOnInit();
      this.field = this.fields[0];
    }
  }

  updateService() {
    const updateData = this.getFormatFormValues(this.form.formView.value);
    const val = updateData[this.field.name];
    const cellData: IccCellEditData<T> = {
      dataKeyId: this.dataKeyId,
      dataKeyValue: this.dataKeyValue as string,
      field: this.field.name,
      value: val
    };

    this.dataSourceService.onSaveGridCellValue(cellData)
      .subscribe(response => {
        this.parent.onGridSavedCellValue(response, cellData);
        this.field.value = this.field.orgValue = val;
        this.formRawData = updateData;
        this.formViewReset();
      }, (error) => {
      });
  }
}

