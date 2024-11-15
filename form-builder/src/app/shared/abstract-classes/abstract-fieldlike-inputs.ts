import {Directive} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {FieldLikeInputData} from "../interfaces/field-like-input-data";
import {AbstractFieldLikeEditForm} from "./abstract-fieldlike-edit-form";
import {AbstractInput} from "./abstract-input";


@Directive()
export abstract class AbstractFieldLikeInputs<D extends FieldLikeInputData<T>, E extends AbstractFieldLikeEditForm<D>, T> extends AbstractInput<D, E, T> {
  override defaultValueSetter(modifiedData: D) {
    super.defaultValueSetter(modifiedData);
    this.data.required = modifiedData.required;
    if (modifiedData.required) {
      this.data.requiredMessage = modifiedData.requiredMessage;
    }
    this.data.showTooltip = modifiedData.showTooltip;
    if (modifiedData.showTooltip) {
      this.data.tooltipText = modifiedData.tooltipText;
    }
  }

  getErrorMessages(control: AbstractControl<string>): string[]{
    return this.errorList()
      .filter(error => control.hasError(error.validatorName))
      .map(error => error.validationMessage);
  }

  errorList(): {validatorName: string, validationMessage: string}[]  {
    return [{
      validatorName: "required",
      validationMessage: this.data.requiredMessage!
    }]
  }
}
