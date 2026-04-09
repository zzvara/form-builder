import { AbstractFieldLikeEditForm } from '@abstract-classes/abstract-fieldlike-edit-form';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponentData } from '@components/input/interfaces/input-component-data';
import { ErrorType } from '@helpers/error-helper';
import { UpdateOnStrategy } from '@interfaces/update-on-strategy';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomValidators } from '@validators/custom-validators';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-input-edit',
  templateUrl: './input-edit.component.html',
  styleUrls: ['./input-edit.component.less'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    NzDividerComponent,
    NzFormLabelComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    QuillEditorComponent,
    NzInputGroupComponent,
    NzInputNumberComponent,
    NzTooltipModule,
    NzInputModule,
    NzCheckboxComponent,
    NzButtonModule,
    NzIconModule,
  ],
})
export class InputEditComponent<T extends InputComponentData = InputComponentData> extends AbstractFieldLikeEditForm<string, T> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      minLength: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      minLengthNumber: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('minLength')),
          CustomValidators.validateMinIf(() => this.getStrictControlValue<boolean>('minLength'), 1),
          CustomValidators.validateMinWithMaxIf(
            () => ({
              maxOn: this.getStrictControlValue<boolean>('maxLength'),
              maxNum: this.getStrictControlValue<number>('maxLengthNumber') ?? 0,
            }),
            () => this.getStrictControlValue<boolean>('minLength')
          ),
        ],
      }),
      minLengthMessage: new FormControl(
        null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('minLength'))
      ),
      maxLength: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      maxLengthNumber: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('maxLength')),
          CustomValidators.validateMinIf(() => this.getStrictControlValue<boolean>('minLength'), 1),
          CustomValidators.validateMaxWithMinIf(
            () => ({
              minOn: this.getStrictControlValue<boolean>('minLength'),
              minNum: this.getStrictControlValue<number>('minLengthNumber') ?? 0,
            }),
            () => this.getStrictControlValue<boolean>('maxLength')
          ),
        ],
      }),
      showCharacterCounter: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
    });
    this.initializeFormValues();

    //TODO: nem működik
    // this.notifyFormGroupOnValueChanges(["required","minLength","maxLength","minLengthNumber","maxLengthNumber","showCharacterCounter"], this.formData);
    // ▼▼▼▼▼ marad az alábbi módszer (manuálisan megmondani, hogy melyik változásakor melyik mások értékelődjenek ki) ▼▼▼▼▼
    this.connectValidations({
      minLength: [{ name: 'minLengthNumber' }, { name: 'minLengthMessage' }, { name: 'defaultValue' }],
      maxLength: [{ name: 'maxLengthNumber' }, { name: 'defaultValue' }],
      minLengthNumber: [{ name: 'maxLengthNumber' }, { name: 'defaultValue' }],
      maxLengthNumber: [{ name: 'minLengthNumber', recursiveCall: true }, { name: 'defaultValue' }],
    });
    this.setControlValuesBasedOnChanges({
      maxLengthNumber: [{ name: 'defaultValue', additionalData: () => null }],
    });
  }

  override saveData() {
    super.saveData();
    this.initialValues.minLength = this.rawFormData.minLength;
    if (this.rawFormData.minLength) {
      this.initialValues.minLengthNumber = this.rawFormData.minLengthNumber;
      this.initialValues.minLengthMessage = this.rawFormData.minLengthMessage;
    }
    this.initialValues.maxLength = this.rawFormData.maxLength;
    if (this.rawFormData.maxLength) {
      this.initialValues.maxLengthNumber = this.rawFormData.maxLengthNumber;
      this.initialValues.showCharacterCounter = this.rawFormData.showCharacterCounter;
    }
  }

  get maxLengthOrNull() {
    return this.getStrictControlValue('maxLength') && this.getStrictControlValue('maxLengthNumber')
      ? this.getStrictControlValue<number>('maxLengthNumber')
      : null;
  }
  get minLengthOrNull() {
    return this.getStrictControlValue('minLength') && this.getStrictControlValue('minLengthNumber')
      ? this.getStrictControlValue<number>('minLengthNumber')
      : null;
  }

  override errorList(): ErrorType[] {
    return super.errorList().concat([
      {
        errorName: 'minlength',
        errorMessage: this.getStrictControlValue<string>('minLengthMessage').replace(
          '{{..}}',
          String(this.getStrictControlValue<number>('minLengthNumber'))
        ),
      },
    ]);
  }
}
