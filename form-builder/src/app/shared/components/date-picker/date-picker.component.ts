import {Component} from '@angular/core';
import {AbstractDatePickerComponent} from "../../abstract-classes/abstract-date-picker-input";
import {DatePickerEditComponent} from "./date-picker-edit/date-picker-edit.component";
import {DatePickerComponentData} from "./interfaces/date-picker-component-data";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent extends AbstractDatePickerComponent<Date, DatePickerComponentData, DatePickerEditComponent> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Date Picker Component Settings',
      modalContent: DatePickerEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }
}
