import {Component} from '@angular/core';
import {FormControl, ValidatorFn} from "@angular/forms";
import {AbstractFieldLikeEditForm} from "../../../abstract-classes/abstract-fieldlike-edit-form";
import {UpdateOnStrategy} from "../../../interfaces/update-on-strategy";
import {CustomValidators} from "../../../validators/custom-validators";
import {TextareaComponentData} from "../interfaces/textarea-component-data";

@Component({
  selector: 'app-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: ['./textarea-edit.component.css']
})
export class TextareaEditComponent extends AbstractFieldLikeEditForm<TextareaComponentData> {
  protected readonly maxDefaultCharacterCount = 5000;

  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      minLength:            new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE,
      }),
      minLengthNumber:      new FormControl<number>(0, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("minLength")),
          CustomValidators.validateMinWithMaxIf(() => [this.getControlValue<boolean>("maxLength"), this.getControlValue<number>("maxLengthNumber") ?? 0], () => this.getControlValue<boolean>("minLength"))
        ]
      }),
      minLengthMessage:     new FormControl(null,
        CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("minLength"))),
      maxLength:            new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE
      }),
      maxLengthNumber:      new FormControl(null, {
        updateOn: UpdateOnStrategy.CHANGE,
        validators: [
          CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("maxLength")),
          CustomValidators.validateMaxWithMinIf(() => [this.getControlValue<boolean>("minLength"), this.getControlValue<number>("minLengthNumber") ?? 0], () => this.getControlValue<boolean>("maxLength"))
        ]
      }),
      showCharacterCounter: new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE
      }),
    });
    this.initializeFormValues();

    //TODO: nem működik
    // this.notifyFormGroupOnValueChanges(["required","minLength","maxLength","minLengthNumber","maxLengthNumber","showCharacterCounter"], this.formData);
    // ▼▼▼▼▼ marad az alábbi módszer ▼▼▼▼▼
    this.connectValidations({
      minLength: [{name: "minLengthNumber"}, {name: "minLengthMessage"}, {name: "defaultValue"}],
      maxLength: [{name: "maxLengthNumber"}, {name: "defaultValue"}],
      minLengthNumber: [{name: "maxLengthNumber"}, {name: "defaultValue"}],
      maxLengthNumber: [{name: "minLengthNumber", recursiveCall: true}, {name: "defaultValue"}]
    });
    this.setControlValuesBasedOnChanges({
      maxLengthNumber: [{name: "defaultValue", additionalData: () => null}],
    })
  }

  override getValidatorsForDefaultValue(): { condition: () => boolean; validation: ValidatorFn }[] {
    return super.getValidatorsForDefaultValue().concat([{
      condition: () => this.getControlValue<boolean>("minLength"),
      validation: CustomValidators.minLengthSupplier(() => this.getControlValue<number>("minLengthNumber"))
    },{
      condition: () => this.getControlValue<boolean>("maxLength"),
      validation: CustomValidators.maxLengthSupplier(() => this.getControlValue<number>("maxLengthNumber"))
    }]);
  }

  override errorList(): { validatorName: string; validationMessage: string }[] {
    return super.errorList().concat([{
      validatorName: "minlength",
      validationMessage: this.getControlValue<string>("minLengthMessage").replace("{*}", String(this.getControlValue<number>("minLengthNumber"))),
    }]);
  }
}
