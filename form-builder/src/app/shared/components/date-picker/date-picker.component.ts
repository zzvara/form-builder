import {Component, EventEmitter, inject, Input, Output, TemplateRef} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {InputEditComponent} from "../input/input-edit/input-edit.component";
import {InputComponentData} from "../input/interfaces/input-component-data";
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
        questionValue: this.questionValue,
        descriptionValue: this.descriptionValue,
        defaultValue: this.defaultValue,
        placeholderValue: this.placeholderValue,
      }
    }).subscribe(result => {
      if (result) {
        this.questionValue = result.questionValue;
        this.descriptionValue = result.descriptionValue;
        this.defaultValue = result.defaultValue;
        this.placeholderValue = result.placeholderValue;
        this.onEdit(result);
      }
    });
  }
}
