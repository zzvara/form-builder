import { AbstractFieldLikeEditForm } from '@abstract-classes/abstract-fieldlike-edit-form';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NumberInputComponentData } from '@components/number-input/interfaces/number-input-component-data';
import { UpdateOnStrategy } from '@interfaces/update-on-strategy';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomValidators } from '@validators/custom-validators';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-number-input-edit',
  templateUrl: './number-input-edit.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    NzDividerComponent,
    NzFormModule,
    NzFormLabelComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    QuillModule,
    NzInputNumberComponent,
    NzTooltipModule,
    NzInputModule,
    NzCheckboxComponent,
    NzButtonModule,
    NzIconModule,
  ],
})
export class NumberInputEditComponent extends AbstractFieldLikeEditForm<number, NumberInputComponentData> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      min: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      minNumber: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('min')),
          CustomValidators.validateMinWithMaxIf(
            () => ({
              maxOn: this.getStrictControlValue<boolean>('max'),
              maxNum: this.getStrictControlValue<number>('maxNumber') ?? 0,
            }),
            () => this.getStrictControlValue<boolean>('min')
          ),
        ],
      }),
      max: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      maxNumber: new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('max')),
          CustomValidators.validateMaxWithMinIf(
            () => ({
              minOn: this.getStrictControlValue<boolean>('min'),
              minNum: this.getStrictControlValue<number>('minNumber') ?? 0,
            }),
            () => this.getStrictControlValue<boolean>('max')
          ),
        ],
      }),
      stepNumber: new FormControl(null, [
        Validators.required,
        CustomValidators.validateMaxPred(() => this.maxNumOrInf - this.minNumOrNegInf),
      ]),
      format: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      formatter: new FormControl(null, [
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>('format')),
        CustomValidators.validateContainsIf(() => this.getStrictControlValue<boolean>('format'), '{{..}}'),
      ]),
    });
    this.initializeFormValues();

    this.connectValidations({
      min: [{ name: 'minNumber' }, { name: 'defaultValue' }],
      max: [{ name: 'maxNumber' }, { name: 'defaultValue' }],
      minNumber: [{ name: 'maxNumber' }, { name: 'stepNumber' }, { name: 'defaultValue' }],
      maxNumber: [{ name: 'minNumber', recursiveCall: true }, { name: 'stepNumber' }, { name: 'defaultValue' }],
      format: [{ name: 'formatter' }, { name: 'defaultValue' }],
    });
    this.setControlValuesBasedOnChanges({
      maxNumber: [{ name: 'defaultValue', additionalData: () => null }],
    });
  }

  override saveData() {
    super.saveData();
    this.initialValues.stepNumber = this.rawFormData.stepNumber;
    this.initialValues.min = this.rawFormData.min;
    if (this.rawFormData.min) {
      this.initialValues.minNumber = this.rawFormData.minNumber;
    }
    this.initialValues.max = this.rawFormData.max;
    if (this.rawFormData.max) {
      this.initialValues.maxNumber = this.rawFormData.maxNumber;
    }
    this.initialValues.format = this.rawFormData.format;
    if (this.rawFormData.format) {
      this.initialValues.formatter = this.rawFormData.formatter;
    }
    if (!this.getControlValue('setDefaultValue')) {
      this.initialValues.defaultValue = undefined;
    }
  }

  get maxNumOrInf() {
    return this.getStrictControlValue('max') && this.getStrictControlValue('maxNumber')
      ? this.getStrictControlValue<number>('maxNumber')
      : Infinity;
  }
  get minNumOrNegInf() {
    return this.getStrictControlValue('min') && this.getStrictControlValue('minNumber')
      ? this.getStrictControlValue<number>('minNumber')
      : -Infinity;
  }

  get inputFormatter(): (value: number) => string {
    if (this.getStrictControlValue('format') && this.getStrictControlValue('formatter')) {
      return (value) => this.getStrictControlValue<string>('formatter').replace('{{..}}', String(value));
    }
    return (value) => String(value);
  }

  get inputParser(): (value: string) => number {
    if (this.getStrictControlValue('format') && this.getStrictControlValue('formatter')) {
      return (value) => {
        const specIndex = this.getStrictControlValue<string>('formatter').indexOf('{{..}}');
        if (specIndex > -1) {
          const [before, after] = [
            this.getStrictControlValue<string>('formatter').substring(0, specIndex),
            this.getStrictControlValue<string>('formatter').substring(
              specIndex + 3,
              this.getStrictControlValue<string>('formatter').length
            ),
          ];
          return Number(value.replace(before, '').replace(after, ''));
        }
        return Number(value);
      };
    }
    return (value) => Number(value);
  }
}
