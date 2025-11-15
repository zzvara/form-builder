import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { EditList } from '@app/pages/edit/interfaces/edit-list';
import { FormService } from '@app/shared/services/form.service';
import { ValidatorService } from '@app/shared/services/validator.service';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrl: './edit-name.component.less',
  standalone: false,
})
export class EditNameComponent implements OnInit, OnChanges {
  @Input() names: string[] = [];
  @Input() edit!: EditList;
  @Output() updateName: EventEmitter<void> = new EventEmitter();

  form: FormGroup = new FormGroup([]);

  isEditName = false;

  constructor(private formService: FormService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['names'] &&
      JSON.stringify(changes['names'].currentValue) !== JSON.stringify(changes['names'].previousValue) &&
      this.isEditName
    ) {
      this.updateNameFieldValidators(this.names);
    }
  }

  saveName(): void {
    this.form.updateValueAndValidity();

    if (this.form.valid) {
      this.edit.data.customTitle = this.form.controls['name'].value;
      this.setEditMode(false);
      this.updateName.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }

  setEditMode(state: boolean): void {
    this.isEditName = state;

    if (this.isEditName) {
      this.form = this.formService.createComponentNameForm(this.names, this.edit.data.customTitle);
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
