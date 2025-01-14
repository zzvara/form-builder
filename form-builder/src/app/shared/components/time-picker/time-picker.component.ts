import { Component } from '@angular/core';
import { AbstractFieldLikeInputs } from "../../abstract-classes/abstract-fieldlike-inputs";
import { disabledHours, disabledMinutes, disabledSeconds } from "../../helpers/date-helper";
import { TimePickerComponentData } from "./interfaces/time-picker-component-data";
import { TimePickerEditComponent } from "./time-picker-edit/time-picker-edit.component";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent extends AbstractFieldLikeInputs<Date, TimePickerComponentData, TimePickerEditComponent> {

  title: string;

  constructor(private translate: TranslateService) {
    super();
    this.title = this.translate.instant('components.time_picker.MODEL_TITLE_TIME_PICKER');
  }

  override edit(): void {
    this.modalService.openModal({
      modalTitle: this.title,
      modalContent: TimePickerEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }

  protected readonly disabledHours = disabledHours;
  protected readonly disabledMinutes = disabledMinutes;
  protected readonly disabledSeconds = disabledSeconds;
}
