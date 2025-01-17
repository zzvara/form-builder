import { Component } from '@angular/core';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { RangePickerComponentData } from '@components/range-picker/interfaces/range-picker-component-data';

@Component({
  selector: 'app-range-picker-edit',
  templateUrl: './range-picker-edit.component.html',
  styleUrls: ['./range-picker-edit.component.css'],
})
export class RangePickerEditComponent extends DatePickerEditComponent<Date[], RangePickerComponentData> {}
