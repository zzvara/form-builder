import {Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AbstractEditForm} from "../../../abstract-classes/abstract-edit-form";
import {InputComponentData} from "../interfaces/input-component-data";
import {CustomValidators} from "../../../validators/custom-validators";

@Component({
  selector: 'app-input-edit',
  templateUrl: './input-edit.component.html',
  styleUrls: ['./input-edit.component.css']
})
export class InputEditComponent extends AbstractEditForm<InputComponentData> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.formData = this.formBuilder.group({
      questionValue:        new FormControl(null,
        Validators.required),
      descriptionValue:     new FormControl(),
      placeholderValue:     new FormControl(),
      defaultValue:         new FormControl(),
      required:             new FormControl(false, {
        updateOn: "change"
      }),
      requiredMessage:      new FormControl(null,
        CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("required"))),
      minLength:            new FormControl(false, {
        updateOn: "change",
      }),
      minLengthNumber:      new FormControl(null, {
        updateOn: "change",
        validators: [
          CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("minLength")),
          CustomValidators.validateMinWithMaxIf(() => [this.getControlValue<boolean>("maxLength"), this.getControlValue<number>("maxLengthNumber") ?? 0], () => this.getControlValue<boolean>("minLength"))
        ]
      }),
      minLengthMessage:     new FormControl(null,
        CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("minLength"))),
      maxLength:            new FormControl(false, {
        updateOn: "change"
      }),
      maxLengthNumber:      new FormControl(null, {
        updateOn: "change",
        validators: [
          CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("maxLength")),
          CustomValidators.validateMaxWithMinIf(() => [this.getControlValue<boolean>("minLength"), this.getControlValue<number>("minLengthNumber") ?? 0], () => this.getControlValue<boolean>("maxLength"))
        ]
      }),
      showCharacterCounter: new FormControl(false, {
        updateOn: "change"
      }),
    },{
      updateOn: "blur"
    });
    this.initializeFormValues();
    this.connectValidations({
      required: [{name: "requiredMessage"}],
      minLength: [{name: "minLengthNumber"}, {name: "minLengthMessage"}],
      maxLength: [{name: "maxLengthNumber"}],
      minLengthNumber: [{name: "maxLengthNumber"}],
      maxLengthNumber: [{name: "minLengthNumber", recursiveCall: true}]
    });
  }
}
