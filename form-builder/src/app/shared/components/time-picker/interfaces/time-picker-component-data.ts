import {FieldLikeInputData} from '@shared/interfaces/field-like-input-data';

export interface TimePickerComponentData extends FieldLikeInputData<Date> {
  minTime: boolean;
  minTimeValue?: Date;

  maxTime: boolean;
  maxTimeValue?: Date;

  timeFormat: string;
  use12Hours: boolean;
  hideDisabledOptions: boolean;

  hourStep: number;
  minuteStep: number;
  secondStep: number;
}
