import { AbstractFieldLikeEditForm } from '@abstract-classes/abstract-fieldlike-edit-form';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { SelectComponentData } from '@components/select/interfaces/select-component-data';
import { UpdateOnStrategy } from '@interfaces/update-on-strategy';
import { CustomValidators } from '@validators/custom-validators';
import { ListValidators } from '@validators/list-validators';

@Component({
  selector: 'app-select-edit',
  templateUrl: './select-edit.component.html',
  styleUrls: ['./select-edit.component.less'],
  standalone: false,
})
export class SelectEditComponent extends AbstractFieldLikeEditForm<string | string[], SelectComponentData> {
  newOption!: FormControl<string | null>;

  get options(): FormArray {
    return this.formData.get('selectOptions') as FormArray;
  }

  get optionsValues(): string[] {
    if (this.formData) {
      return this.options.controls.map((ctrl) => ctrl.value);
    }
    return [];
  }

  get newOptionValue(): string | null {
    return this.newOption.getRawValue();
  }
  set newOptionValue(value: string) {
    this.newOption.setValue(value);
  }

  get isMultipleChoice(): boolean {
    return this.formData.get('isMultipleChoice')?.getRawValue();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      selectOptions: this.formBuilder.array([], ListValidators.validateListNum(2)),
      isMultipleChoice: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
    });

    this.newOption = new FormControl(null, {
      updateOn: UpdateOnStrategy.CHANGE,
      validators: [
        Validators.required,
        CustomValidators.validateStringNotEmpty,
        CustomValidators.validateIsInList(() => this.optionsValues),
      ],
    });

    this.initializeFormValues();
  }

  override initializeFormValues() {
    if (this.initialValues) {
      this.formData.patchValue(this.initialValues);
      this.initialValues.selectOptions.forEach((option) => {
        this.options.push(new FormControl(option, Validators.required));
      });
    }
  }

  override saveData() {
    super.saveData();
    this.initialValues.selectOptions = this.rawFormData.selectOptions;
    this.initialValues.questionValue = this.rawFormData.questionValue;
    this.initialValues.descriptionValue = this.rawFormData.descriptionValue;
    if (!this.getControlValue('setDefaultValue') || !this.rawFormData.defaultValue) {
      if (this.rawFormData.isMultipleChoice) {
        this.initialValues.defaultValue = [];
      } else {
        this.initialValues.defaultValue = '';
      }
    } else {
      this.initialValues.defaultValue = this.rawFormData.defaultValue;
    }
    this.initialValues.placeholderValue = this.rawFormData.placeholderValue;
    this.initialValues.isMultipleChoice = this.rawFormData.isMultipleChoice;
  }

  override get defaultValueUpdateOn() {
    return UpdateOnStrategy.CHANGE;
  }

  //----------------------------------------------------------------------------------------------------------------------

  getDefaultValues(): string | string[] {
    return this.formData.get('defaultValue')?.getRawValue();
  }

  setDefaultValue(values: string | string[]): void {
    this.formData.get('defaultValue')?.setValue(values);
  }

  // Add a new option
  addOption() {
    this.options.push(new FormControl(this.newOptionValue, Validators.required));
    this.newOptionValue = '';
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  // Remove an existing option
  removeOption(option: AbstractControl<string>, optionIndex: number) {
    this.options.removeAt(optionIndex);
    if (Array.isArray(this.getDefaultValues())) {
      this.setDefaultValue((this.getDefaultValues() as string[]).filter((opt) => opt !== option.value));
    } else {
      this.setDefaultValue('');
    }
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  getMinOptions(): number {
    const error: any = this.getError(this.options, 'minLengthError');
    return error.min - error.current;
  }

  override onReset() {
    super.onReset();
    this.newOption.reset();
    this.options.clear();
    this.initialValues.selectOptions.forEach((option) => {
      this.options.push(new FormControl(option, Validators.required));
    });
  }

  drop(event: CdkDragDrop<AbstractControl[]>) {
    moveItemInArray(this.options.controls, event.previousIndex, event.currentIndex);
  }
}
