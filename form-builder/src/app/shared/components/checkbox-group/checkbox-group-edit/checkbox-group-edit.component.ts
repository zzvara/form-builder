import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { CheckboxGroupData, CheckboxOptions } from '@components/checkbox-group/interfaces/checkbox-group-data';
import { UpdateOnStrategy } from '@interfaces/update-on-strategy';
import { CustomValidators } from '@validators/custom-validators';
import { ListValidators } from '@validators/list-validators';

@Component({
  selector: 'app-checkbox-group-edit',
  templateUrl: './checkbox-group-edit.component.html',
  styleUrls: [],
  standalone: false,
})
export class CheckboxGroupEditComponent extends AbstractEditForm<CheckboxOptions[], CheckboxGroupData> {
  newOption!: FormControl<string | null>;
  get newOptionValue(): string | null {
    return this.newOption.getRawValue();
  }
  set newOptionValue(value: string) {
    this.newOption.setValue(value);
  }

  get options(): FormArray {
    return this.formData.get('defaultValue') as FormArray;
  }

  get optionIds(): number[] {
    if (this.formData) {
      return this.options.controls.map((ctrl) => ctrl.value.value);
    }
    return [];
  }
  get optionDescriptions(): string[] {
    if (this.formData) {
      return this.options.controls.map((ctrl) => ctrl.value.label);
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
    });

    this.connectValidations({
      required: [{ name: 'requiredMessage' }],
    });

    this.initializeFormValues();

    this.newOption = new FormControl(null, {
      updateOn: UpdateOnStrategy.CHANGE,
      validators: [
        Validators.required,
        CustomValidators.validateStringNotEmpty,
        CustomValidators.validateIsInList(() => this.optionDescriptions),
      ],
    });
  }

  override get defaultValueControl(): AbstractControl {
    return this.formBuilder.array([], ListValidators.validateListNum(1));
  }

  override initializeFormValues() {
    if (this.initialValues) {
      this.formData.patchValue(this.initialValues);
      this.initialValues.defaultValue?.forEach((option) => {
        this.options.push(
          this.formBuilder.group({
            label: new FormControl(option.label, Validators.required),
            value: new FormControl(option.value, Validators.required),
            disabled: new FormControl(option.disabled),
            checked: new FormControl(option.checked),
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
    this.initialValues.defaultValue?.forEach((option) => {
      this.options.push(
        this.formBuilder.group({
          label: new FormControl(option.label, Validators.required),
          value: new FormControl(option.value, Validators.required),
          disabled: new FormControl(option.disabled),
          checked: new FormControl(option.checked),
        })
      );
    });
  }

  override saveData() {
    super.saveData();
    this.initialValues.required = this.rawFormData.required;
    if (this.rawFormData.required) {
      this.initialValues.requiredMessage = this.rawFormData.requiredMessage;
    }
  }

  //----------------------------------------------------------------------------------------------------------------------

  getNextId() {
    return Math.max(...this.optionIds.concat(0)) + 1;
  }

  // Add a new option
  addOption() {
    this.options.push(
      this.formBuilder.group({
        label: new FormControl(this.newOptionValue, Validators.required),
        value: new FormControl(this.getNextId(), Validators.required),
        disabled: new FormControl(false),
        checked: new FormControl(false),
      })
    );
    this.newOptionValue = '';
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  // Remove an existing option
  removeOption(optionIndex: number) {
    this.options.removeAt(optionIndex);
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
