import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AbstractEditForm} from "../../../abstract-classes/abstract-edit-form";
import {DatePickerComponentData} from "../interfaces/date-picker-component-data";

@Component({
  selector: 'app-date-picker-edit',
  templateUrl: './date-picker-edit.component.html',
  styleUrls: ['./date-picker-edit.component.css']
})
export class DatePickerEditComponent extends AbstractEditForm<DatePickerComponentData>{
  override ngOnInit(): void {
    super.ngOnInit();
    this.formData = this.formBuilder.group({
      questionValue:    new FormControl(null, Validators.required),
      descriptionValue: new FormControl(null, Validators.required),
      placeholderValue: new FormControl(),
      defaultValue:     new FormControl()
    });
    this.initializeFormValues();
  }
}
