import {AbstractFieldLikeEditForm} from '@abstract-classes/abstract-fieldlike-edit-form';
import {AbstractInput} from '@abstract-classes/abstract-input';
import {Directive} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {ErrorType, getErrorMessageList} from '@helpers/error-helper';
import {FieldLikeInputData} from '@shared/interfaces/field-like-input-data';

@Directive()
export abstract class AbstractFieldLikeInputs<T, D extends FieldLikeInputData<T>, E extends AbstractFieldLikeEditForm<T, D>> extends AbstractInput<T, D, E> {
  getErrorMessages(control: AbstractControl<string>): string[] {
    return getErrorMessageList(control, this.errorList());
  }

  errorList(): ErrorType[] {
    return [
      {
        errorName: 'required',
        errorMessage: this.data.requiredMessage!,
      },
    ];
  }
}
