import {AbstractControl} from "@angular/forms";

export interface ErrorType {
  errorName: string,
  errorMessage: string,
}

export function getErrorMessageList(control: AbstractControl<string>, errors: ErrorType[]): string[]{
  return errors
    .filter(error => control.hasError(error.errorName))
    .map(error => error.errorMessage);
}
