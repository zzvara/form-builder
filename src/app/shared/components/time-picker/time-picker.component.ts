import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePickerComponentData } from '@components/time-picker/interfaces/time-picker-component-data';
import { TimePickerEditComponent } from '@components/time-picker/time-picker-edit/time-picker-edit.component';
import { disabledHours, disabledMinutes, disabledSeconds } from '@helpers/date-helper';
import { NzFormControlComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    NzFormItemComponent,
    NzFormControlComponent,
    NzTimePickerModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzToolTipModule
  ]
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
