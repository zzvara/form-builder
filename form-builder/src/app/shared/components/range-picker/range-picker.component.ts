import {Component} from '@angular/core';
import {AbstractDatePickerComponent} from "../../abstract-classes/abstract-date-picker-input";
import {RangePickerComponentData} from "./interfaces/range-picker-component-data";
import {RangePickerEditComponent} from "./range-picker-edit/range-picker-edit.component";

@Component({
  selector: 'app-range-picker',
  templateUrl: './range-picker.component.html',
  styleUrls: ['./range-picker.component.css']
})
export class RangePickerComponent extends AbstractDatePickerComponent<Date[], RangePickerComponentData, RangePickerEditComponent> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Range Picker Component Settings',
      modalContent: RangePickerEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }

  getPlaceholder(): string[] {
    if (this.data.placeholderValue) {
      return this.data.placeholderValue.split("|", 2);
    }
    return [];
  }
}
