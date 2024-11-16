import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {DatePickerEditComponent} from "./date-picker-edit/date-picker-edit.component";
import {DatePickerComponentData} from "./interfaces/date-picker-component-data";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent extends AbstractFieldLikeInputs<DatePickerComponentData, DatePickerEditComponent, Date> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: DatePickerEditComponent,
      modalData: this.data
    }).subscribe(result => {
      if (result) {
        this.onEdit(this.data);
      }
    });
  }
}
