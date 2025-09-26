import { AbstractDatePickerComponent } from '@abstract-classes/abstract-date-picker-input';
import { Component } from '@angular/core';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: [],
  standalone: false,
})
export class DatePickerComponent extends AbstractDatePickerComponent<Date, DatePickerComponentData, DatePickerEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.DATE_PICKER.MODEL_TITLE_DATE_PICKER'),
        modalContent: DatePickerEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
