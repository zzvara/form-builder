import {Component, inject} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {DatePickerEditComponent} from "./date-picker-edit/date-picker-edit.component";
import {DatePickerComponentData} from "./interfaces/date-picker-component-data";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent extends AbstractInput<DatePickerComponentData, Date> {
  private readonly modalService: ModalServiceService<DatePickerEditComponent, DatePickerComponentData> = inject(ModalServiceService);

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: DatePickerEditComponent,
      modalData: {
        questionValue:    this.data.questionValue,
        descriptionValue: this.data.descriptionValue,
        defaultValue:     this.data.defaultValue,
        placeholderValue: this.data.placeholderValue,
      }
    }).subscribe(result => this.defaultValueSetter(result));
  }
}
