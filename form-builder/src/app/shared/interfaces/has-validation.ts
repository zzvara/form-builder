import {AbstractControl} from "@angular/forms";

export interface HasValidation<T> {
  getErrors(control: AbstractControl<T>): string;
}
