import {Component, inject, OnInit} from '@angular/core';

import {NZ_MODAL_DATA} from 'ng-zorro-antd/modal';
import {AbstractEditForm} from "../../../abstract-classes/abstract-edit-form";
import {SelectComponentData} from "../interfaces/select-component-data";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ListValidators} from "../../../validators/list-validators";
import {CustomValidators} from "../../../validators/custom-validators";

@Component({
  selector: 'app-select-edit',
  templateUrl: './select-edit.component.html',
  styleUrls: ['./select-edit.component.css']
})
export class SelectEditComponent extends AbstractEditForm<SelectComponentData> {
  newOption!: FormControl<string | null>;

  override ngOnInit(): void {
    super.ngOnInit();
    this.formData = this.formBuilder.group({
      selectOptions:      this.formBuilder.array([],
        ListValidators.validateListNum(2)),
      defaultValue: new FormControl(null, {
        updateOn: "change"
      }),
      questionValue:      new FormControl(null, Validators.required),
      descriptionValue:   new FormControl(null, Validators.required),
      placeholderValue:   new FormControl(),
      isMultipleChoice:   new FormControl(false, {
        updateOn: "change"
      })
    }, {
      updateOn: "blur"
    });

    this.newOption = new FormControl(null, {
      updateOn: "change",
      validators: [
        Validators.required,
        CustomValidators.validateStringNotEmpty,
        CustomValidators.validateIsInList(() => this.optionsValues)]
    });

    this.initializeFormValues();
  }

  override initializeFormValues() {
    if (this.initialValues) {
      this.formData.patchValue(this.initialValues);
      this.initialValues.selectOptions.forEach(option => {
        this.options.push(new FormControl(option));
      });
    }
  }

  get options(): FormArray {
    return  this.formData.get('selectOptions') as FormArray;
  }
  get optionsValues(): string[] {
    if ( this.formData) {
      return this.options.controls.map(ctrl => ctrl.value);
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
    return  this.formData.get('isMultipleChoice')?.getRawValue();
  }
//----------------------------------------------------------------------------------------------------------------------

  getDefaultValues(): string | string[] {
    return  this.formData.get("defaultValue")?.getRawValue();
  }
  setDefaultValue(values: string | string[]): void {
     this.formData.get("defaultValue")?.setValue(values);
  }

  // Add a new option
  addOption() {
    this.options.push(new FormControl(this.newOptionValue));
    this.newOptionValue = "";
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  // Remove an existing option
  removeOption(option: AbstractControl<string>, optionIndex: number) {
    this.options.removeAt(optionIndex);
    if (Array.isArray(this.getDefaultValues())) {
      this.setDefaultValue((this.getDefaultValues() as string[]).filter(opt => opt !== option.value));
    } else {
      this.setDefaultValue("");
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
    this.initialValues.selectOptions.forEach(option => {
      this.options.push(new FormControl(option));
    });
  }
}