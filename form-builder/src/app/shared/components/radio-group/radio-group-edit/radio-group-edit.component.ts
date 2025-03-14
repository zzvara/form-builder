import {AbstractEditForm} from '@abstract-classes/abstract-edit-form';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component} from '@angular/core';
import {AbstractControl, FormArray, FormControl, Validators} from '@angular/forms';
import {RadioGroupData} from '@components/radio-group/interfaces/radio-group-data';
import {ErrorType, getErrorMessageList} from '@helpers/error-helper';
import {UpdateOnStrategy} from '@shared/interfaces/update-on-strategy';
import {CustomValidators} from '@validators/custom-validators';
import {ListValidators} from '@validators/list-validators';

@Component({
    selector: 'app-radio-group-edit',
    templateUrl: './radio-group-edit.component.html',
    styleUrl: './radio-group-edit.component.css',
    standalone: false
})
export class RadioGroupEditComponent extends AbstractEditForm<number, RadioGroupData> {
  newOption!: FormControl<string | null>;
  get newOptionValue(): string | null {
    return this.newOption.getRawValue();
  }
  set newOptionValue(value: string) {
    this.newOption.setValue(value);
  }

  get options(): FormArray {
    return this.formData.get('options') as FormArray;
  }
  get optionObjects(): typeof this.initialValues.options {
    if (this.formData) {
      return this.options.controls.map((ctrl) => ctrl.value);
    }
    return [];
  }
  get optionIds(): number[] {
    if (this.formData) {
      return this.options.controls.map((ctrl) => ctrl.value.option_id);
    }
    return [];
  }
  get optionDescriptions(): string[] {
    if (this.formData) {
      return this.options.controls.map((ctrl) => ctrl.value.option_description);
    }
    return [];
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      required: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      requiredMessage: new FormControl(
        null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('required'))
      ),
      isButton: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      options: this.formBuilder.array([], ListValidators.validateListNum(2)),
    });

    this.connectValidations({
      required: [{ name: 'requiredMessage' }, { name: 'defaultValue' }],
    });

    this.initializeFormValues();
    this.setupDefaultValueCheckBox();

    this.newOption = new FormControl(null, {
      updateOn: UpdateOnStrategy.CHANGE,
      validators: [
        Validators.required,
        CustomValidators.validateStringNotEmpty,
        CustomValidators.validateIsInList(() => this.optionDescriptions),
      ],
    });
  }

  override initializeFormValues() {
    if (this.initialValues) {
      this.formData.patchValue(this.initialValues);
      this.initialValues.options.forEach((option) => {
        this.options.push(
          this.formBuilder.group({
            option_id: new FormControl(option.option_id, Validators.required),
            option_description: new FormControl(option.option_description, Validators.required),
          })
        );
      });
    }
  }

  override onReset() {
    super.onReset();
    this.getControl<boolean>('setDefaultValue')?.setValue(true);
    this.newOption.reset();
    this.options.clear();
    this.initialValues.options.forEach((option) => {
      this.options.push(
        this.formBuilder.group({
          option_id: new FormControl(option.option_id, Validators.required),
          option_description: new FormControl(option.option_description, Validators.required),
        })
      );
    });
  }

  override saveData() {
    super.saveData();
    this.initialValues.isButton = this.rawFormData.isButton;
    this.initialValues.options = this.rawFormData.options;
    this.initialValues.required = this.rawFormData.required;
    if (this.rawFormData.required) {
      this.initialValues.requiredMessage = this.rawFormData.requiredMessage;
    }
    if (!this.getControlValue('setDefaultValue')) {
      this.initialValues.defaultValue = undefined;
    }
  }

  override get defaultValueValidators() {
    return CustomValidators.executeValidationsConditionally([
      {
        condition: () => this.getStrictControlValue<boolean>('required'),
        validation: Validators.required,
      },
    ]);
  }

  override get defaultValueUpdateOn() {
    return UpdateOnStrategy.CHANGE;
  }

  //----------------------------------------------------------------------------------------------------------------------

  setupDefaultValueCheckBox() {
    //Add custom form control
    this.addAnyControls({
      setDefaultValue: new FormControl<boolean>(true, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
    });
  }

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

  //----------------------------------------------------------------------------------------------------------------------

  getNextId() {
    return Math.max(...this.optionIds.concat(0)) + 1;
  }

  // Add a new option
  addOption() {
    this.options.push(
      this.formBuilder.group({
        option_id: new FormControl(this.getNextId(), Validators.required),
        option_description: new FormControl(this.newOptionValue, Validators.required),
      })
    );
    this.newOptionValue = '';
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  // Remove an existing option
  removeOption(optionIndex: number) {
    this.options.removeAt(optionIndex);
    this.getStrictControl('defaultValue')?.setValue(undefined);
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  getMinOptions(): number {
    const error: any = this.getError(this.options, 'minLengthError');
    return error.min - error.current;
  }

  drop(event: CdkDragDrop<AbstractControl[]>) {
    moveItemInArray(this.options.controls, event.previousIndex, event.currentIndex);
  }
}
