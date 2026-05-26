import { AbstractFieldLikeEditForm } from '@abstract-classes/abstract-fieldlike-edit-form';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectionStrategy, signal, Signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SelectComponentData } from '@components/select/interfaces/select-component-data';
import { UpdateOnStrategy } from '@interfaces/update-on-strategy';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomValidators } from '@validators/custom-validators';
import { ListValidators } from '@validators/list-validators';
import { MutateTextDirective } from '@app/shared/directives/mutate-text.directive';

// Ng-Zorro importok
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
} from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-select-edit',
  templateUrl: './select-edit.component.html',
  styleUrls: ['./select-edit.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MutateTextDirective,
    DragDropModule,
    NzFormModule,
    NzDividerComponent,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzInputGroupComponent,
    NzInputModule,
    NzCheckboxModule,
    NzSelectModule,
    QuillModule,
    TranslatePipe,
  ],
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

  get isMultipleChoice(): boolean {
    return this.getStrictControlValue<boolean>('isMultipleChoice') ?? false;
  }

  get newOptionValue(): string | null {
    return this.newOption.getRawValue();
  }
  set newOptionValue(value: string) {
    this.newOption.setValue(value);
  }

  get isMultipleChoice(): boolean {
    return this.formData.controls['isMultipleChoice'].getRawValue();
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

  getDefaultValues(): string | string[] {
    return this.formData.controls['defaultValue'].getRawValue();
  }

  setDefaultValue(values: string | string[]): void {
    this.formData.controls['defaultValue'].setValue(values);
  }

  addOption() {
    this.options.push(new FormControl(this.newOptionValue, Validators.required));
    this.newOptionValue = '';
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

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

  startEdit(index: number, value: string) {
    this._editingIndex.set(index);
    this._editError.set(null);
    this.editControl.setValue(value);
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

    const defaults = this.getDefaultValues();
    if (Array.isArray(defaults)) {
      const updated = defaults.map((v) => (v === this.optionsValues[index] ? newValue : v));
      this.setDefaultValue(updated);
    } else if (defaults === this.optionsValues[index]) {
      this.setDefaultValue(newValue);
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
