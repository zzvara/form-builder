import {FieldLikeInputData} from "../../../interfaces/field-like-input-data";
import {NzDateMode} from "ng-zorro-antd/date-picker";

export interface DatePickerComponentData extends FieldLikeInputData<Date> {
  minDate: boolean;
  minDateValue?: Date;

  maxDate: boolean;
  maxDateValue?: Date;

  mode: NzDateMode;
  dateFormat: string;
  showTime: boolean;
  timeFormat: string;
  showWeekNumber: boolean;
  inlineMode : boolean;
}
