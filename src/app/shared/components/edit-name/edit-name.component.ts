import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ChangeDetectionStrategy, signal, Signal, WritableSignal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { EditList } from '@app/pages/edit/interfaces/edit-list';
import { FormInputData } from '@app/shared/interfaces/form-input-data';
import { FormService } from '@app/shared/services/form.service';
import { ValidatorService } from '@app/shared/services/validator.service';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrl: './edit-name.component.less',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditNameComponent implements OnChanges {
  @Input() names: string[] = [];
  @Input() edit!: EditList | FormInputData;
  @Output() updateName: EventEmitter<void> = new EventEmitter();

  form: FormGroup = new FormGroup([]);

  private readonly _editList: WritableSignal<EditList | undefined> = signal(undefined);
  public readonly editList: Signal<EditList | undefined> = this._editList.asReadonly();

  private readonly _editFormInput: WritableSignal<FormInputData | undefined> = signal(undefined);
  public readonly editFormInput: Signal<FormInputData | undefined> = this._editFormInput.asReadonly();

  private readonly _isEditName: WritableSignal<boolean> = signal(false);
  public readonly isEditName: Signal<boolean> = this._isEditName.asReadonly();

  constructor(private formService: FormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['names'] &&
      JSON.stringify(changes['names'].currentValue) !== JSON.stringify(changes['names'].previousValue) &&
      this._isEditName()
    ) {
      this.updateNameFieldValidators(this.names);
    } else if (changes['edit'] && JSON.stringify(changes['edit'].currentValue) !== JSON.stringify(changes['edit'].previousValue)) {
      if ('id' in this.edit) {
        this._editList.set(this.edit as EditList);
        this._editFormInput.set(undefined);
      } else if ('title' in this.edit) {
        this._editFormInput.set(this.edit as FormInputData);
        this._editList.set(undefined);
      }
    }
  }

  saveName(): void {
    this.form.updateValueAndValidity();

    if (this.form.valid) {
      const list = this._editList();
      const input = this._editFormInput();

      if (list) {
        list.data.customTitle = this.form.controls['name'].value;
      } else if (input) {
        input.customTitle = this.form.controls['name'].value;
      }
      this.setEditMode(false);
      this.updateName.emit();
    } else {
      this.form.markAllAsTouched();
      Object.values(this.form.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  setEditMode(state: boolean): void {
    this._isEditName.set(state);

    if (state) {
      this.form = this.formService.createComponentNameForm(this.names, ('id' in this.edit ? this.edit.data : this.edit).customTitle);
    } else {
      this.form = new FormGroup([]);
    }
  }

  private updateNameFieldValidators(names: string[]) {
    this.form.controls['name'].clearValidators();
    this.form.controls['name'].addValidators([
      Validators.required,
      ValidatorService.validVariableNameValidator(),
      ValidatorService.uniqueNameValidator(names),
    ]);
    this.form.controls['name'].updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
}
