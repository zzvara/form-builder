import { AbstractDatePickerComponent } from '@abstract-classes/abstract-date-picker-input';
import { Component } from '@angular/core';
import { RangePickerComponentData } from '@components/range-picker/interfaces/range-picker-component-data';
import { RangePickerEditComponent } from '@components/range-picker/range-picker-edit/range-picker-edit.component';

@Component({
  selector: 'app-range-picker',
  templateUrl: './range-picker.component.html',
  styleUrls: [],
  standalone: false,
})
export class RangePickerComponent extends AbstractDatePickerComponent<Date[], RangePickerComponentData, RangePickerEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('components.range_picker.MODEL_TITLE_RANGE_PICKER'),
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
