import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditList } from '@app/pages/edit/interfaces/edit-list';
import { FormInputData } from '@app/shared/interfaces/form-input-data';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';
import { ComponentIconsPipe } from '@app/shared/pipes/used-component-icons.pipe';
import { FormService } from '@app/shared/services/form.service';
import { ValidatorService } from '@app/shared/services/validator.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrl: './edit-name.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    InstanceOfFormInputDataPipe,
    ComponentIconsPipe,
    NzTooltipModule,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputModule,
    TranslatePipe,
  ],
})
export class EditNameComponent {
  readonly names = input<string[]>([]);
  readonly edit = input.required<EditList | FormInputData>();
  readonly updateName = output<void>();

  readonly form = signal<FormGroup>(new FormGroup([]));
  readonly editList = computed<EditList | undefined>(() => {
    const edit = this.edit();
    return 'id' in edit ? edit : undefined;
  });
  readonly editFormInput = computed<FormInputData | undefined>(() => {
    const edit = this.edit();
    return !('id' in edit) && 'title' in edit ? edit : undefined;
  });

  readonly isEditName = signal(false);

  constructor(private formService: FormService) {
    effect(() => {
      const names = this.names();
      if (untracked(this.isEditName)) {
        untracked(() => this.updateNameFieldValidators(names));
      }
    });
  }

  saveName(): void {
    const form = this.form();
    form.updateValueAndValidity();

    if (form.valid) {
      const editList = this.editList();
      const editFormInput = this.editFormInput();
      if (editList) {
        editList.data.customTitle = form.controls['name'].value;
      } else if (editFormInput) {
        editFormInput.customTitle = form.controls['name'].value;
      }
      this.setEditMode(false);
      this.updateName.emit();
    } else {
      form.markAllAsTouched();
      Object.values(form.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  setEditMode(state: boolean): void {
    this.isEditName.set(state);

    if (state) {
      const edit = this.edit();
      this.form.set(
        this.formService.createComponentNameForm(
          this.names(),
          ('id' in edit ? edit.data : edit).customTitle,
        ),
      );
    } else {
      this.form.set(new FormGroup([]));
    }
  }

  private updateNameFieldValidators(names: string[]) {
    const form = this.form();
    form.controls['name'].clearValidators();
    form.controls['name'].addValidators([
      Validators.required,
      ValidatorService.validVariableNameValidator(),
      ValidatorService.uniqueNameValidator(names),
    ]);
    form.controls['name'].updateValueAndValidity();
    form.updateValueAndValidity();
  }
}