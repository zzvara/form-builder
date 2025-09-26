import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { Component } from '@angular/core';
import { TimePickerComponentData } from '@components/time-picker/interfaces/time-picker-component-data';
import { TimePickerEditComponent } from '@components/time-picker/time-picker-edit/time-picker-edit.component';
import { disabledHours, disabledMinutes, disabledSeconds } from '@helpers/date-helper';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: [],
  standalone: false,
})
export class TimePickerComponent extends AbstractFieldLikeInputs<Date, TimePickerComponentData, TimePickerEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.TIME_PICKER.MODEL_TITLE_TIME_PICKER'),
        modalContent: TimePickerEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }

  protected readonly disabledHours = disabledHours;
  protected readonly disabledMinutes = disabledMinutes;
  protected readonly disabledSeconds = disabledSeconds;
}
