import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';
import { getDisabledDateConfig, getDisabledTimeConfig } from '@helpers/date-helper';
import { DisabledTimeConfig, DisabledTimeFn, SupportTimeOptions } from 'ng-zorro-antd/date-picker';

export abstract class AbstractDatePickerComponent<
  T extends Date | Date[],
  D extends DatePickerComponentData<T>,
  E extends DatePickerEditComponent<T, D>,
> extends AbstractFieldLikeInputs<T, D, E> {
  protected readonly getDisabledDateConfig = getDisabledDateConfig;

  disabledTime: DisabledTimeFn = (current: Date | Date[]): DisabledTimeConfig | undefined => {
    const data = this.state();
    if (data.showTime) {
      return getDisabledTimeConfig(data, current as Date);
    }
    return undefined;
  };

  get getTimeOptions(): SupportTimeOptions | null {
    const data = this.state();
    if (data.showTime) {
      return {
        nzFormat: data.timeFormat,
        nzHideDisabledOptions: false,
      };
    }
    return null;
  }

  get getFullFormat() {
    const data = this.state();
    if (data.showTime) {
      return data.dateFormat + data.timeFormat;
    }
    return data.dateFormat;
  }
}
