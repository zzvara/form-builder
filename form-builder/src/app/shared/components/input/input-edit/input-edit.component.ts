import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldLikeEditForm } from '@abstract-classes/abstract-fieldlike-edit-form';
import { ErrorType } from '@helpers/error-helper';
import { UpdateOnStrategy } from '@shared/interfaces/update-on-strategy';
import { CustomValidators } from '@validators/custom-validators';
import { InputComponentData } from '@components/input/interfaces/input-component-data';

@Component({
  selector: 'app-input-edit',
  templateUrl: './input-edit.component.html',
  styleUrls: ['./input-edit.component.css'],
})
export class InputEditComponent<T extends InputComponentData = InputComponentData> extends AbstractFieldLikeEditForm<string, T> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      minLength: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      minLengthNumber: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('minLength')),
          CustomValidators.validateMinIf(() => this.getStrictControlValue<boolean>('minLength'), 1),
          CustomValidators.validateMinWithMaxIf(
            () => ({
              maxOn: this.getStrictControlValue<boolean>('maxLength'),
              maxNum: this.getStrictControlValue<number>('maxLengthNumber') ?? 0,
            }),
            () => this.getStrictControlValue<boolean>('minLength')
          ),
        ],
      }),
      minLengthMessage: new FormControl(
        null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('minLength'))
      ),
      maxLength: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      maxLengthNumber: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('maxLength')),
          CustomValidators.validateMinIf(() => this.getStrictControlValue<boolean>('minLength'), 1),
          CustomValidators.validateMaxWithMinIf(
            () => ({
              minOn: this.getStrictControlValue<boolean>('minLength'),
              minNum: this.getStrictControlValue<number>('minLengthNumber') ?? 0,
            }),
            () => this.getStrictControlValue<boolean>('maxLength')
          ),
        ],
      }),
      showCharacterCounter: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
    });
    this.initializeFormValues();

    //TODO: nem működik
    // this.notifyFormGroupOnValueChanges(["required","minLength","maxLength","minLengthNumber","maxLengthNumber","showCharacterCounter"], this.formData);
    // ▼▼▼▼▼ marad az alábbi módszer (manuálisan megmondani, hogy melyik változásakor melyik mások értékelődjenek ki) ▼▼▼▼▼
    this.connectValidations({
      minLength: [{ name: 'minLengthNumber' }, { name: 'minLengthMessage' }, { name: 'defaultValue' }],
      maxLength: [{ name: 'maxLengthNumber' }, { name: 'defaultValue' }],
      minLengthNumber: [{ name: 'maxLengthNumber' }, { name: 'defaultValue' }],
      maxLengthNumber: [{ name: 'minLengthNumber', recursiveCall: true }, { name: 'defaultValue' }],
    });
    this.setControlValuesBasedOnChanges({
      maxLengthNumber: [{ name: 'defaultValue', additionalData: () => null }],
    });
  }

  override saveData() {
    super.saveData();
    this.initialValues.minLength = this.rawFormData.minLength;
    if (this.rawFormData.minLength) {
      this.initialValues.minLengthNumber = this.rawFormData.minLengthNumber;
      this.initialValues.minLengthMessage = this.rawFormData.minLengthMessage;
    }
    this.initialValues.maxLength = this.rawFormData.maxLength;
    if (this.rawFormData.maxLength) {
      this.initialValues.maxLengthNumber = this.rawFormData.maxLengthNumber;
      this.initialValues.showCharacterCounter = this.rawFormData.showCharacterCounter;
    }
  }

  get maxLengthOrNull() {
    return this.getStrictControlValue('maxLength') && this.getStrictControlValue('maxLengthNumber')
      ? this.getStrictControlValue<number>('maxLengthNumber')
      : null;
  }
  get minLengthOrNull() {
    return this.getStrictControlValue('minLength') && this.getStrictControlValue('minLengthNumber')
      ? this.getStrictControlValue<number>('minLengthNumber')
      : null;
  }

  override errorList(): ErrorType[] {
    return super.errorList().concat([
      {
        errorName: 'minlength',
        errorMessage: this.getStrictControlValue<string>('minLengthMessage').replace(
          '{*}',
          String(this.getStrictControlValue<number>('minLengthNumber'))
        ),
      },
    ]);
  }
}
