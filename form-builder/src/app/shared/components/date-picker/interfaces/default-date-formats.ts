import {NzDateMode} from 'ng-zorro-antd/date-picker';

export type DefaultDateFormats = {
  [key in NzDateMode]: string;
};

export const defaultDateFormats: DefaultDateFormats = {
  date: 'yyyy-MM-dd',
  decade: "yyyy'''s'",
  year: 'yyyy',
  month: 'yyyy-MM',
  week: 'yyyy-ww',
  time: 'HH:mm:ss',
  quarter: 'yyyy-Q',
};
