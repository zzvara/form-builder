import { Directive } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ErrorType, getErrorMessageList } from '@helpers/error-helper';
import { identifyStringArray } from '@helpers/identification-helper';
import { FieldLikeInputData } from '@shared/interfaces/field-like-input-data';
import { UpdateOnStrategy } from '@shared/interfaces/update-on-strategy';
import { CustomValidators } from '@validators/custom-validators';
import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';

@Directive()
export abstract class AbstractFieldLikeEditForm<T, D extends FieldLikeInputData<T>> extends AbstractEditForm<T, D> {
  protected readonly Infinity = Infinity;

  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      placeholderValue: new FormControl(),
      required: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      requiredMessage: new FormControl(
        null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('required'))
      ),
      showTooltip: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      tooltipText: new FormControl(
        null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('showTooltip'))
      ),
    });
    this.connectValidations({
      required: [{ name: 'requiredMessage' }, { name: 'defaultValue' }],
      showTooltip: [{ name: 'tooltipText' }],
    });
    this.setupDefaultValueCheckBox();
  }

  override onReset() {
    super.onReset();
    this.getControl<boolean>('setDefaultValue')?.setValue(true);
  }

  override saveData() {
    super.saveData();
    this.initialValues.placeholderValue = this.rawFormData.placeholderValue;
    this.initialValues.required = this.rawFormData.required;
    if (this.rawFormData.required) {
      this.initialValues.requiredMessage = this.rawFormData.requiredMessage;
    }
    this.initialValues.showTooltip = this.rawFormData.showTooltip;
    if (this.rawFormData.showTooltip) {
      this.initialValues.tooltipText = this.rawFormData.tooltipText;
    }
    if (!this.getControlValue('setDefaultValue')) {
      this.initialValues.defaultValue = undefined;
    }
  }

  //----------------------------------------------------------------------------------------------------------------------

  setupDefaultValueCheckBox() {
    //Add custom form control
    this.addAnyControls({
      setDefaultValue: new FormControl<boolean>(true, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
    });
    this.getControl<boolean>('setDefaultValue')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((checked) => {
        if (checked) {
          this.getStrictControl<string>('defaultValue')?.setValidators(this.defaultValueValidators);
        } else {
          this.getStrictControl<string>('defaultValue')?.clearValidators();
        }
      });
    this.connectAnyValidations({
      setDefaultValue: [{ name: 'defaultValue' }],
    });
  }

  override get defaultValueValidators() {
    return CustomValidators.executeValidationsConditionally(this.getValidatorsForDefaultValue());
  }

  getValidatorsForDefaultValue(): { condition: () => boolean; validation: ValidatorFn }[] {
    return [
      {
        condition: () => this.getStrictControlValue<boolean>('required'),
        validation: Validators.required,
      },
    ];
  }

  //----------------------------------------------------------------------------------------------------------------------

  protected readonly identifyErrorMessages = identifyStringArray;
  getErrorMessages(control: AbstractControl<string>): string[] {
    return getErrorMessageList(control, this.errorList());
  }

  errorList(): ErrorType[] {
    return [
      {
        errorName: 'required',
        errorMessage: this.getStrictControlValue<string>('requiredMessage'),
      },
    ];
  }
}
