import {Component} from '@angular/core';
import {AbstractFieldLikeEditForm} from "../../../abstract-classes/abstract-fieldlike-edit-form";
import {UpdateOnStrategy} from "../../../interfaces/update-on-strategy";
import {DatePickerComponentData} from "../interfaces/date-picker-component-data";

@Component({
  selector: 'app-date-picker-edit',
  templateUrl: './date-picker-edit.component.html',
  styleUrls: ['./date-picker-edit.component.css']
})
export class DatePickerEditComponent extends AbstractFieldLikeEditForm<DatePickerComponentData, Date>{
  override ngOnInit(): void {
    super.ngOnInit();
    this.initializeFormValues();
  }

  override get defaultValueUpdateOn() {
    return UpdateOnStrategy.CHANGE;
  };
}
