import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { AbstractControl, FormArray } from '@angular/forms';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MutateTextDirective } from '@app/shared/directives/mutate-text.directive';
import type { RadioGroupData } from '@components/radio-group/interfaces/radio-group-data';
import type { ErrorType } from '@helpers/error-helper';
import { getErrorMessageList } from '@helpers/error-helper';
import { UpdateOnStrategy } from '@interfaces/update-on-strategy';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomValidators } from '@validators/custom-validators';
import { ListValidators } from '@validators/list-validators';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import {
  NzFormModule,
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { QuillModule } from 'ngx-quill';
import { CodeEditorModalComponent } from '@components/code-editor/code-editor-modal/code-editor-modal.component';

@Component({
  selector: 'app-radio-group-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group-edit.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzDividerComponent,
    NzFormItemComponent,
    NzTableModule,
    DragDropModule,
    NzIconModule,
    NzButtonModule,
    NzFormControlComponent,
    NzInputGroupComponent,
    MutateTextDirective,
    NzFormLabelComponent,
    QuillModule,
    NzInputModule,
    NzCheckboxModule,
    NzSelectModule,
    NzRadioModule,
    TranslatePipe,
    CodeEditorModalComponent,
  ],
})
export class RadioGroupEditComponent extends AbstractEditForm<number, RadioGroupData> {
  private readonly cdr = inject(ChangeDetectorRef);
  newOption!: FormControl<string | null>;
  editControl: FormControl = new FormControl('');
  readonly editingIndex = signal<number | null>(null);
  readonly editError = signal<string | null>(null);
  get newOptionValue(): string | null {
    return this.newOption.getRawValue();
  }
  set newOptionValue(value: string) {
    this.newOption.setValue(value);
  }

  get options(): FormArray {
    return this.formData.controls['options'] as FormArray;
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
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('required')),
      ),
      isButton: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      options: this.formBuilder.array([], ListValidators.validateListNum(2)),
    });

    this.connectValidations({
      required: [{ name: 'requiredMessage' }],
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
    this.options.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.newOption.updateValueAndValidity());
  }

  override initializeFormValues() {
    if (this.initialValues) {
      this.formData.patchValue(this.initialValues);
      this.initialValues.options.forEach((option) => {
        this.options.push(
          this.formBuilder.group({
            option_id: new FormControl(option.option_id, Validators.required),
            option_description: new FormControl(option.option_description, Validators.required),
          }),
        );
      });
    }
  }

  override onReset() {
    super.onReset();
    this.cancelEdit();
    this.getControl<boolean>('setDefaultValue')?.setValue(true);
    this.newOption.reset();
    this.options.clear();
    this.initialValues.options.forEach((option) => {
      this.options.push(
        this.formBuilder.group({
          option_id: new FormControl(option.option_id, Validators.required),
          option_description: new FormControl(option.option_description, Validators.required),
        }),
      );
    });
    this.cdr.markForCheck();
  }

  override saveData() {
    super.saveData();
    this.initialValues.defaultValue = this.rawFormData.defaultValue ?? undefined;
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

  override get defaultValueUpdateOn() {
    return UpdateOnStrategy.CHANGE;
  }

  //----------------------------------------------------------------------------------------------------------------------

  selectDefaultOption(optionId: number, checked: boolean) {
    const control = this.getStrictControl('defaultValue');
    control?.setValue(checked ? optionId : undefined);
    control?.markAsDirty();
    control?.markAsTouched();
  }

  setupDefaultValueCheckBox(): void {
    const control = new FormControl<boolean>(true, {
      updateOn: UpdateOnStrategy.CHANGE,
    });
    this.addAnyControls({
      setDefaultValue: control,
    });
    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled) => {
      if (!enabled) {
        this.getStrictControl('defaultValue')?.setValue(undefined);
      }
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
    if (this.newOption.invalid) return;
    this.options.push(
      this.formBuilder.group({
        option_id: new FormControl(this.getNextId(), Validators.required),
        option_description: new FormControl(this.newOptionValue, Validators.required),
      }),
    );
    this.newOptionValue = '';
    this.options.markAsDirty();
    this.options.markAsTouched();
  }

  // Remove an existing option
  removeOption(optionIndex: number) {
    const optionId = this.options.at(optionIndex).value.option_id;
    this.options.removeAt(optionIndex);
    if (this.getControlValue('defaultValue') === optionId) {
      this.getStrictControl('defaultValue')?.setValue(undefined);
    }
    this.cancelEdit();
    this.options.markAsDirty();
    this.options.markAsTouched();
  }
  startEdit(i: number, value: string) {
    this.editingIndex.set(i);
    this.editError.set(null);
    this.editControl = new FormControl(value, Validators.required);
  }
  saveEdit(i: number) {
    const newValue = this.editControl.value?.trim();
    if (!newValue) return;
    const otherValues = this.optionDescriptions.filter((_, idx) => idx !== i);
    if (otherValues.includes(newValue)) {
      this.editError.set(this.translate.instant('COMPONENTS.ERROR_DUPLICATE_OPTION'));
      return;
    }
    this.options.at(i).patchValue({ option_description: newValue });
    this.options.markAsDirty();
    this.options.markAsTouched();
    this.editingIndex.set(null);
    this.editError.set(null);
  }
  cancelEdit() {
    this.editingIndex.set(null);
    this.editError.set(null);
  }

  getMinOptions(): number {
    const error = this.getError<{ min: number; current: number }>(this.options, 'minLengthError');
    return error ? error.min - error.current : 0;
  }

  drop(event: CdkDragDrop<AbstractControl[]>) {
    if (event.previousIndex === event.currentIndex) return;
    const option = this.options.at(event.previousIndex);
    this.options.removeAt(event.previousIndex);
    this.options.insert(event.currentIndex, option);
    this.options.markAsDirty();
    this.options.markAsTouched();
    this.cancelEdit();
  }
}
