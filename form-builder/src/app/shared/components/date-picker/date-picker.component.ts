import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {DatePickerEditComponent} from "./date-picker-edit/date-picker-edit.component";
import {DatePickerComponentData} from "./interfaces/date-picker-component-data";
import {DisabledTimeConfig, DisabledTimeFn, SupportTimeOptions} from "ng-zorro-antd/date-picker";
import {getDisabledDateConfig, getDisabledTimeConfig} from "../../helpers/date-helper";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent extends AbstractFieldLikeInputs<DatePickerComponentData, DatePickerEditComponent, Date> {
  protected readonly getDisabledDateConfig = getDisabledDateConfig;

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: DatePickerEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }

  disabledTime: DisabledTimeFn = (current: Date | Date[]): DisabledTimeConfig | undefined => {
    if (this.data.showTime) {
      return getDisabledTimeConfig(this.data, current as Date);
    }
    return undefined;
  }

  get getTimeOptions(): SupportTimeOptions | null {
    if (this.data.showTime) {
      return {
        nzFormat: this.data.timeFormat,
        nzHideDisabledOptions: false
      };
    }
    return null;
  }

  get getFullFormat() {
    if (this.data.showTime) {
      return this.data.dateFormat + " " + this.data.timeFormat;
    }
    return this.data.dateFormat;
  }
}
