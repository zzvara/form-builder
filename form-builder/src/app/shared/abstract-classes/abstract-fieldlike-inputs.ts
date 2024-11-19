import {Directive} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {ErrorType, getErrorMessageList} from "../helpers/error-helper";
import {identifyStringArray} from "../helpers/identification-helper";
import {FieldLikeInputData} from "../interfaces/field-like-input-data";
import {AbstractFieldLikeEditForm} from "./abstract-fieldlike-edit-form";
import {AbstractInput} from "./abstract-input";


@Directive()
export abstract class AbstractFieldLikeInputs<D extends FieldLikeInputData<T>, E extends AbstractFieldLikeEditForm<D, T>, T> extends AbstractInput<D, E, T> {
  protected readonly identifyErrorMessages = identifyStringArray;
  getErrorMessages(control: AbstractControl<string>): string[]{
    return getErrorMessageList(control, this.errorList());
  }

  errorList(): ErrorType[]  {
    return [{
      errorName: "required",
      errorMessage: this.data.requiredMessage!
    }];
  }
}
