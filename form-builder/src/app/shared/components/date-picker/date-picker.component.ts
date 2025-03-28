import { AbstractDatePickerComponent } from '@abstract-classes/abstract-date-picker-input';
import { Component } from '@angular/core';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: [],
  standalone: false,
})
export class DatePickerComponent extends AbstractDatePickerComponent<Date, DatePickerComponentData, DatePickerEditComponent> {
  title: string; // Declare title variable

  constructor(private readonly translate: TranslateService) {
    super();
    // @todo We could do without this variable, since it's only used in one place. Could "modalTitle: this.translate.instant('components.date_picker.MODEL_TITLE_DATE_PICKER')" work?
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
