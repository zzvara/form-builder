import { AbstractDatePickerComponent } from '@abstract-classes/abstract-date-picker-input';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RangePickerComponentData } from '@components/range-picker/interfaces/range-picker-component-data';
import { RangePickerEditComponent } from '@components/range-picker/range-picker-edit/range-picker-edit.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NzDatePickerModule, NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormControlComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-range-picker',
  templateUrl: './range-picker.component.html',
  styleUrls: ['./range-picker.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzRangePickerComponent,
    NzTooltipModule,
    TranslatePipe,
    NzDatePickerModule,
  ],
})
export class RangePickerComponent extends AbstractDatePickerComponent<Date[], RangePickerComponentData, RangePickerEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.RANGE_PICKER.MODEL_TITLE_RANGE_PICKER'),
        modalContent: RangePickerEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }

  getPlaceholder(): string[] {
    if (this.data.placeholderValue) {
      return this.data.placeholderValue.split('|', 2);
    }
    return [];
  }
}
