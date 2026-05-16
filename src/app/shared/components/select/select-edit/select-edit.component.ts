import { AbstractFieldLikeEditForm } from '@abstract-classes/abstract-fieldlike-edit-form';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectionStrategy, signal, Signal, WritableSignal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectEditComponent extends AbstractFieldLikeEditForm<string | string[], SelectComponentData> {
  newOption!: FormControl<string | null>;
  editControl: FormControl = new FormControl('');

  private readonly _editingIndex: WritableSignal<number | null> = signal(null);
  public readonly editingIndex: Signal<number | null> = this._editingIndex.asReadonly();

  private readonly _editError: WritableSignal<string | null> = signal(null);
  public readonly editError: Signal<string | null> = this._editError.asReadonly();

  get options(): FormArray {
    return this.formData.controls['selectOptions'] as FormArray;
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

  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      selectOptions: this.formBuilder.array([], ListValidators.validateListNum(2)),
      isMultipleChoice: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
    });

    this.connectValidations({
      isMultipleChoice: [{ name: 'defaultValue' }],
    });

    this.setControlValuesBasedOnChanges({
      isMultipleChoice: [{ name: 'defaultValue', additionalData: () => null }],
    });

    this.initializeFormValues();

    this.newOption = new FormControl(null, {
      updateOn: UpdateOnStrategy.CHANGE,
      validators: [
        Validators.required,
        CustomValidators.validateStringNotEmpty,
        CustomValidators.validateIsInList(() => this.optionsValues),
      ],
    });
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
    this.initialValues.isMultipleChoice = this.rawFormData.isMultipleChoice;
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

  addOption() {
    this.options.push(new FormControl(this.newOptionValue, Validators.required));
    this.newOptionValue = '';
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  removeOption(optionIndex: number) {
    this.options.removeAt(optionIndex);
    this.getStrictControl('defaultValue')?.setValue(undefined);
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  startEdit(i: number, value: string) {
    this._editingIndex.set(i);
    this._editError.set(null);
    this.editControl = new FormControl(value, Validators.required);
  }

  saveEdit(index: number) {
    const newValue = this.editControl.value?.trim();

    if (!newValue) {
      this._editingIndex.set(null);
      return;
    }
    const values = this.optionsValues.filter((_, i) => i !== index);
    if (values.includes(newValue)) {
      this._editError.set(this.translate.instant('COMPONENTS.ERROR_DUPLICATE_OPTION'));
      return;
    }
    this._editError.set(null);
    const control = this.options.at(index) as FormControl;
    control.setValue(newValue);
    control.markAsDirty();
    control.markAsTouched();

    const defaults = this.getStrictControlValue<string | string[]>('defaultValue');
    if (Array.isArray(defaults)) {
      const updated = defaults.map((v) => (v === this.optionsValues[index] ? newValue : v));
      this.getStrictControl('defaultValue')?.setValue(updated);
    } else if (defaults === this.optionsValues[index]) {
      this.getStrictControl('defaultValue')?.setValue(newValue);
    }

    this._editingIndex.set(null);
  }

  cancelEdit() {
    this._editingIndex.set(null);
    this._editError.set(null);
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
