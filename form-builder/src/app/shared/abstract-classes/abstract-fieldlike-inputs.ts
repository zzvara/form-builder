import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ErrorType, getErrorMessageList } from '@helpers/error-helper';
import { identifyStringArray } from '@helpers/identification-helper';
import { FieldLikeInputData } from '@shared/interfaces/field-like-input-data';
import { AbstractFieldLikeEditForm } from '@abstract-classes/abstract-fieldlike-edit-form';
import { AbstractInput } from '@abstract-classes/abstract-input';

@Directive()
export abstract class AbstractFieldLikeInputs<
  T,
  D extends FieldLikeInputData<T>,
  E extends AbstractFieldLikeEditForm<T, D>
> extends AbstractInput<T, D, E> {
  protected readonly identifyErrorMessages = identifyStringArray;
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
