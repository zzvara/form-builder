import { Component } from '@angular/core';
import { AbstractDatePickerComponent } from '@abstract-classes/abstract-date-picker-input';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent extends AbstractDatePickerComponent<Date, DatePickerComponentData, DatePickerEditComponent> {
  title: string; // Declare title variable

  constructor(private translate: TranslateService) {
    super();
    this.title = this.translate.instant('components.date_picker.MODEL_TITLE_DATE_PICKER');
  }

  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.title,
        modalContent: DatePickerEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
