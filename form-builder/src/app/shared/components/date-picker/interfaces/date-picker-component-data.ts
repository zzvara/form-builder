import { MinMaxDateable } from '@helpers/date-helper';
import { FieldLikeInputData } from '@shared/interfaces/field-like-input-data';

export interface DatePickerComponentData<T = Date> extends FieldLikeInputData<T>, MinMaxDateable {
  dateFormat: string;
  showTime: boolean;
  timeFormat: string;
  showWeekNumber: boolean;
  inlineMode: boolean;
}
