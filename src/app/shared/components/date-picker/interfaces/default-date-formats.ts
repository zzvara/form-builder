import { DateFormat } from '@app/shared/constants/date-format.constant';
import type { NzDateMode } from 'ng-zorro-antd/date-picker';

export type DefaultDateFormats = Record<NzDateMode, string>;

export const defaultDateFormats: DefaultDateFormats = {
  date: DateFormat.DATE,
  decade: DateFormat.DECADE,
  year: DateFormat.YEAR,
  month: DateFormat.MONTH,
  week: DateFormat.WEEK,
  time: DateFormat.TIME,
  quarter: DateFormat.QUARTER,
};
