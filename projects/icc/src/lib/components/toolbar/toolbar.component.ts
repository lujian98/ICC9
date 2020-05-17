import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IccFieldViewService } from '../../directives/field-view/field-view.service';
import { IccField } from '../../items';
import { IccItemFieldService } from '../../items/item_field.service';
import { IccFieldConfig } from '../../models/item-config';

@Component({
  selector: 'icc-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class IccToolbarComponent implements OnInit, OnChanges {
  @Input() toolbarItemConfig: IccFieldConfig[];
  toolbarItems: IccField[];

  @Output() menuItemClickEvent: EventEmitter<IccField> = new EventEmitter();

  constructor(
    private itemService: IccItemFieldService,
    private fieldViewService: IccFieldViewService,
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.toolbarItemConfig) {
      this.toolbarItems = this.getToolbarItems(this.toolbarItemConfig);
      console.log( ' this.toolbarItems =', this.toolbarItems);
    }
  }

  private getToolbarItems(configs: IccFieldConfig[]): IccField[] {
    if (configs.length > 0) {
      const items = [];
      configs.forEach((config: IccFieldConfig) => {
        items.push(this.getToolbarItem(config));
      });
      return items;
    }
  }

  private getToolbarItem(config: IccFieldConfig): IccField {
    if (!config.type) {
      config.type = 'button';
    }
    const item = this.itemService.getItem(config);
    item.toolbarField = this.fieldViewService.getFieldView(config);
    return item;
  }

  toolbarFieldClickEvent(item: IccField) {
    console.log( ' tool bar click22222222 =', item);
    this.menuItemClickEvent.emit(item);
  }
}

