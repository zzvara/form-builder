import {AbstractDatePickerComponent} from '@abstract-classes/abstract-date-picker-input';
import {Component} from '@angular/core';
import {RangePickerComponentData} from '@components/range-picker/interfaces/range-picker-component-data';
import {RangePickerEditComponent} from '@components/range-picker/range-picker-edit/range-picker-edit.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-range-picker',
    templateUrl: './range-picker.component.html',
    styleUrls: ['./range-picker.component.css'],
    standalone: false
})
export class RangePickerComponent extends AbstractDatePickerComponent<Date[], RangePickerComponentData, RangePickerEditComponent> {
  title: string;

  constructor(private readonly translate: TranslateService) {
    super();
    this.title = this.translate.instant('components.range_picker.MODEL_TITLE_RANGE_PICKER');
  }

  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.title,
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
