import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IccDatePresetItem } from '../model/model';

@Component({
  selector: 'icc-calendar-presets',
  templateUrl: './calendar-presets.component.html',
  styleUrls: ['./calendar-presets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IccCalendarPresetsComponent implements OnInit {
  @Input()
  presets: Array<IccDatePresetItem>;
  @Output()
  readonly presetChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  setPresetPeriod(event) {
    this.presetChanged.emit(event);
  }
}
