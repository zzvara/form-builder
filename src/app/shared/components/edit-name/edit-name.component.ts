import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
})
export class EditNameComponent implements OnChanges {
  @Input() names: string[] = [];
  @Input() edit!: EditList | FormInputData;
  @Output() updateName: EventEmitter<void> = new EventEmitter();

  form: FormGroup = new FormGroup([]);
  editList?: EditList;
  editFormInput?: FormInputData;

  isEditName = false;

  constructor(private formService: FormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['names'] &&
      JSON.stringify(changes['names'].currentValue) !== JSON.stringify(changes['names'].previousValue) &&
      this.isEditName
    ) {
      this.updateNameFieldValidators(this.names);
    } else if (changes['edit'] && JSON.stringify(changes['edit'].currentValue) !== JSON.stringify(changes['edit'].previousValue)) {
      if ('id' in this.edit) {
        this.editList = this.edit;
      } else if ('title' in this.edit) {
        this.editFormInput = this.edit;
      }
    }
  }

  saveName(): void {
    this.form.updateValueAndValidity();

    if (this.form.valid) {
      if (this.editList) {
        this.editList.data.customTitle = this.form.controls['name'].value;
      } else if (this.editFormInput) {
        this.editFormInput.customTitle = this.form.controls['name'].value;
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
    this.isEditName = state;

    if (this.isEditName) {
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
