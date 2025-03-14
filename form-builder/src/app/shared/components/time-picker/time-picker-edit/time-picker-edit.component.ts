import {AbstractFieldLikeEditForm} from '@abstract-classes/abstract-fieldlike-edit-form';
import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {TimePickerComponentData} from '@components/time-picker/interfaces/time-picker-component-data';
import {
  disabledHours,
  disabledMaxHours,
  disabledMaxMinutes,
  disabledMaxSeconds,
  disabledMinHours,
  disabledMinMinutes,
  disabledMinSeconds,
  disabledMinutes,
  disabledSeconds,
} from '@helpers/date-helper';
import {UpdateOnStrategy} from '@shared/interfaces/update-on-strategy';
import {CustomValidators} from '@validators/custom-validators';

@Component({
    selector: 'app-time-picker-edit',
    templateUrl: './time-picker-edit.component.html',
    styleUrls: ['./time-picker-edit.component.css'],
    standalone: false
})
export class TimePickerEditComponent extends AbstractFieldLikeEditForm<Date, TimePickerComponentData> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      minTime: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      minTimeValue: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('minTime')),
          CustomValidators.validateTimeMinWithMaxIf(
            () => ({
              maxOn: this.getStrictControlValue<boolean>('maxTime'),
              maxTime: this.getStrictControlValue<Date>('maxTimeValue'),
            }),
            () => this.getStrictControlValue<boolean>('minTime')
          ),
        ],
      }),
      maxTime: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      maxTimeValue: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('maxTime')),
          CustomValidators.validateTimeMaxWithMinIf(
            () => ({
              minOn: this.getStrictControlValue<boolean>('minTime'),
              minTime: this.getStrictControlValue<Date>('minTimeValue'),
            }),
            () => this.getStrictControlValue<boolean>('maxTime')
          ),
        ],
      }),
      timeFormat: new FormControl(null, Validators.required),
      use12Hours: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      hideDisabledOptions: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      hourStep: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(24)]),
      minuteStep: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(60)]),
      secondStep: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(60)]),
    });
    this.initializeFormValues();

    this.connectValidations({
      minTime: [{ name: 'minTimeValue' }, { name: 'defaultValue' }],
      maxTime: [{ name: 'maxTimeValue' }, { name: 'defaultValue' }],
      minTimeValue: [{ name: 'maxTimeValue' }, { name: 'defaultValue' }],
      maxTimeValue: [{ name: 'minTimeValue', recursiveCall: true }],
    });
    this.setControlValuesBasedOnChanges({
      // maxDateValue change calls minDateValue recursively, so no need to include it here either
      maxTimeValue: [{ name: 'defaultValue', additionalData: () => null }],
      timeFormat: [
        { name: 'maxTimeValue', additionalData: () => null },
        { name: 'minTimeValue', additionalData: () => null },
      ],
    });
  }

  override saveData() {
    super.saveData();
    this.initialValues.timeFormat = this.rawFormData.timeFormat;
    this.initialValues.use12Hours = this.rawFormData.use12Hours;
    this.initialValues.hideDisabledOptions = this.rawFormData.hideDisabledOptions;
    this.initialValues.hourStep = this.rawFormData.hourStep;
    this.initialValues.minuteStep = this.rawFormData.minuteStep;
    this.initialValues.secondStep = this.rawFormData.secondStep;
    this.initialValues.minTime = this.rawFormData.minTime;
    if (this.rawFormData.minTime) {
      this.initialValues.minTimeValue = this.rawFormData.minTimeValue;
    }
    this.initialValues.maxTime = this.rawFormData.maxTime;
    if (this.rawFormData.maxTime) {
      this.initialValues.maxTimeValue = this.rawFormData.maxTimeValue;
    }
  }

  override get defaultValueUpdateOn() {
    return UpdateOnStrategy.CHANGE;
  }

  protected readonly disabledHours = disabledHours;
  protected readonly disabledMinutes = disabledMinutes;
  protected readonly disabledSeconds = disabledSeconds;

  getDisabledMaxHours() {
    if (this.getStrictControlValue('maxTime') && this.getStrictControlValue('maxTimeValue')) {
      return disabledMaxHours(this.getStrictControlValue<Date>('maxTimeValue'));
    }
    return undefined;
  }
  getDisabledMaxMinutes() {
    if (this.getStrictControlValue('maxTime') && this.getStrictControlValue('maxTimeValue')) {
      return disabledMaxMinutes(this.getStrictControlValue<Date>('maxTimeValue'));
    }
    return undefined;
  }
  getDisabledMaxSeconds() {
    if (this.getStrictControlValue('maxTime') && this.getStrictControlValue('maxTimeValue')) {
      return disabledMaxSeconds(this.getStrictControlValue<Date>('maxTimeValue'));
    }
    return undefined;
  }

  getDisabledMinHours() {
    if (this.getStrictControlValue('minTime') && this.getStrictControlValue('minTimeValue')) {
      return disabledMinHours(this.getStrictControlValue<Date>('minTimeValue'));
    }
    return undefined;
  }
  getDisabledMinMinutes() {
    if (this.getStrictControlValue('minTime') && this.getStrictControlValue('minTimeValue')) {
      return disabledMinMinutes(this.getStrictControlValue<Date>('minTimeValue'));
    }
    return undefined;
  }
  getDisabledMinSeconds() {
    if (this.getStrictControlValue('minTime') && this.getStrictControlValue('minTimeValue')) {
      return disabledMinSeconds(this.getStrictControlValue<Date>('minTimeValue'));
    }
    return undefined;
  }
}
