import {Directive} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {FieldLikeInputData} from "../interfaces/field-like-input-data";
import {AbstractFieldLikeEditForm} from "./abstract-fieldlike-edit-form";
import {AbstractInput} from "./abstract-input";


@Directive()
export abstract class AbstractFieldLikeInputs<D extends FieldLikeInputData<T>, E extends AbstractFieldLikeEditForm<D>, T> extends AbstractInput<D, E, T> {
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
