import {AbstractFieldLikeEditForm} from '@abstract-classes/abstract-fieldlike-edit-form';
import {Component} from '@angular/core';
import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {DatePickerComponentData} from '@components/date-picker/interfaces/date-picker-component-data';
import {defaultDateFormats} from '@components/date-picker/interfaces/default-date-formats';
import {
  getDisabledDateConfig,
  getDisabledDatesForMaxDate,
  getDisabledDatesForMinDate,
  getDisabledTimeConfig,
  getDisabledTimeConfigForMaxDate,
  getDisabledTimeConfigForMinDate,
} from '@helpers/date-helper';
import {TranslateService} from '@ngx-translate/core';
import {UpdateOnStrategy} from '@shared/interfaces/update-on-strategy';
import {CustomValidators} from '@validators/custom-validators';
import {DisabledTimeConfig, DisabledTimeFn, NzDateMode, SupportTimeOptions} from 'ng-zorro-antd/date-picker';

@Component({
    selector: 'app-date-picker-edit',
    templateUrl: './date-picker-edit.component.html',
    styleUrls: ['./date-picker-edit.component.css'],
    standalone: false
})
export class DatePickerEditComponent< T extends Date | Date[] = Date,  D extends DatePickerComponentData<T> = DatePickerComponentData<T> > extends AbstractFieldLikeEditForm<T, D> {
  constructor(private readonly translate: TranslateService) {
    super();
  }

  datePickerModes: { mode: NzDateMode; label: string }[] = [
    { mode: 'decade', label: this.translate.instant('components.date_picker.DECADE') },
    { mode: 'year', label: this.translate.instant('components.date_picker.YEAR') },
    { mode: 'month', label: this.translate.instant('components.date_picker.MONTH') },
    { mode: 'week', label: this.translate.instant('components.date_picker.WEEK') },
    { mode: 'date', label: this.translate.instant('components.date_picker.FULL_DATE') },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      minDate: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      minDateValue: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('minDate')),
          CustomValidators.validateDateMinWithMaxIf(
            () => ({
              maxOn: this.getStrictControlValue<boolean>('maxDate'),
              maxDate: this.getStrictControlValue<Date>('maxDateValue'),
              mode: this.getStrictControlValue<NzDateMode>('mode'),
              showTime: this.getStrictControlValue<boolean>('showTime'),
            }),
            () => this.getStrictControlValue<boolean>('minDate')
          ),
        ],
      }),
      maxDate: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      maxDateValue: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('maxDate')),
          CustomValidators.validateDateMaxWithMinIf(
            () => ({
              minOn: this.getStrictControlValue<boolean>('minDate'),
              minDate: this.getStrictControlValue<Date>('minDateValue'),
              mode: this.getStrictControlValue<NzDateMode>('mode'),
              showTime: this.getStrictControlValue<boolean>('showTime'),
            }),
            () => this.getStrictControlValue<boolean>('maxDate')
          ),
        ],
      }),
      mode: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      dateFormat: new FormControl(null, Validators.required),
      showTime: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      timeFormat: new FormControl(
        null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('timeFormat'))
      ),
      showWeekNumber: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      inlineMode: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
    });
    this.initializeFormValues();

    this.connectValidations({
      minDate: [{ name: 'minDateValue' }, { name: 'defaultValue' }],
      maxDate: [{ name: 'maxDateValue' }, { name: 'defaultValue' }],
      minDateValue: [{ name: 'maxDateValue' }, { name: 'defaultValue' }],
      maxDateValue: [{ name: 'minDateValue', recursiveCall: true }],
      // maxDateValue change calls minDateValue recursively, so no need to include it here
      showTime: [{ name: 'timeFormat' }],
    });
    this.setControlValuesBasedOnChanges({
      // maxDateValue change calls minDateValue recursively, so no need to include it here either
      maxDateValue: [{ name: 'defaultValue', additionalData: () => null }],
      // maxDateValue change sets defaultValue to null, so no need to include it here
      mode: [
        { name: 'maxDateValue', additionalData: () => null },
        { name: 'minDateValue', additionalData: () => null },
        { name: 'dateFormat', additionalData: (caller: AbstractControl<NzDateMode>) => defaultDateFormats[caller.value] },
        {
          name: 'showTime',
          additionalData: (caller: AbstractControl<NzDateMode>, current: boolean) => (caller.value !== 'date' ? false : current),
        },
      ],
      dateFormat: [
        { name: 'maxDateValue', additionalData: () => null },
        { name: 'minDateValue', additionalData: () => null },
      ],
      timeFormat: [
        { name: 'maxDateValue', additionalData: () => null },
        { name: 'minDateValue', additionalData: () => null },
      ],
    });
  }

  override saveData() {
    super.saveData();
    this.initialValues.mode = this.rawFormData.mode;
    this.initialValues.dateFormat = this.rawFormData.dateFormat;
    this.initialValues.showWeekNumber = this.rawFormData.showWeekNumber;
    this.initialValues.inlineMode = this.rawFormData.inlineMode;
    this.initialValues.minDate = this.rawFormData.minDate;
    if (this.rawFormData.minDate) {
      this.initialValues.minDateValue = this.rawFormData.minDateValue;
    }
    this.initialValues.maxDate = this.rawFormData.maxDate;
    if (this.rawFormData.maxDate) {
      this.initialValues.maxDateValue = this.rawFormData.maxDateValue;
    }
    this.initialValues.showTime = this.rawFormData.showTime;
    if (this.rawFormData.showTime) {
      this.initialValues.timeFormat = this.rawFormData.timeFormat;
    }
  }

  override get defaultValueUpdateOn() {
    return UpdateOnStrategy.CHANGE;
  }

  protected readonly getDisabledDateConfig = getDisabledDateConfig;

  disabledTime: DisabledTimeFn = (current: Date | Date[]): DisabledTimeConfig | undefined => {
    if (this.getStrictControlValue('showTime')) {
      return getDisabledTimeConfig(this.rawFormData, current as Date);
    }
    return undefined;
  };

  get getTimeOptions(): SupportTimeOptions | null {
    if (this.getStrictControlValue('showTime')) {
      return {
        nzFormat: this.getStrictControlValue('timeFormat'),
        nzHideDisabledOptions: false,
      };
    }
    return null;
  }

  get getFullFormat(): string {
    if (this.getStrictControlValue('showTime')) {
      return this.getStrictControlValue<string>('dateFormat') + this.getStrictControlValue<string>('timeFormat');
    }
    return this.getStrictControlValue<string>('dateFormat');
  }

  get getDisabledDatesForMin() {
    if (this.getStrictControlValue('maxDate')) {
      return getDisabledDatesForMaxDate(this.getStrictControlValue<Date>('maxDateValue'), this.getStrictControlValue<NzDateMode>('mode'));
    }
    return undefined;
  }
  get getDisabledDatesForMax() {
    if (this.getStrictControlValue('minDate')) {
      return getDisabledDatesForMinDate(this.getStrictControlValue<Date>('minDateValue'), this.getStrictControlValue<NzDateMode>('mode'));
    }
    return undefined;
  }

  disabledTimeConfigForMin: DisabledTimeFn = (current: Date | Date[]): DisabledTimeConfig | undefined => {
    if (this.getStrictControlValue('showTime') && this.getStrictControlValue('maxDate')) {
      return getDisabledTimeConfigForMaxDate(current as Date, this.getStrictControlValue('maxDateValue'));
    }
    return undefined;
  };
  disabledTimeConfigForMax: DisabledTimeFn = (current: Date | Date[]): DisabledTimeConfig | undefined => {
    if (this.getStrictControlValue('showTime') && this.getStrictControlValue('minDate')) {
      return getDisabledTimeConfigForMinDate(current as Date, this.getStrictControlValue('minDateValue'));
    }
    return undefined;
  };
}
