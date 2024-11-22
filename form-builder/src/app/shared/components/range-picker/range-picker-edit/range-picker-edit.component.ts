import {Component} from '@angular/core';
import {DatePickerEditComponent} from "../../date-picker/date-picker-edit/date-picker-edit.component";
import {RangePickerComponentData} from "../interfaces/range-picker-component-data";

@Component({
  selector: 'app-range-picker-edit',
  templateUrl: './range-picker-edit.component.html',
  styleUrls: ['./range-picker-edit.component.css']
})
export class RangePickerEditComponent extends DatePickerEditComponent<Date[], RangePickerComponentData> { }
