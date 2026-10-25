import { AbstractDatePickerComponent } from '@abstract-classes/abstract-date-picker-input';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';
import { TranslatePipe } from '@ngx-translate/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormControlComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    NzFormItemComponent,
    NzFormControlComponent,
    NzDatePickerComponent,
    NzTooltipModule,
    NzIconModule,
  ],
})
export class DatePickerComponent extends AbstractDatePickerComponent<
  Date,
  DatePickerComponentData,
  DatePickerEditComponent
> {
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
