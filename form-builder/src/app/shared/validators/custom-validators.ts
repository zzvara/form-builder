import {AbstractControl, FormArray} from "@angular/forms";

export class CustomValidators {

  static validateStringNotEmpty(control: AbstractControl) {
    const value = control.value as string;
    if (value && value.trim().length === 0) {
      return {
        fieldIsEmpty: true
      };
    }
    return null;
  }

  static validateIsInList(list: () => any[]) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (list().some(val => val === value)) {
        return {
          listContainsItem: value
        };
      }
      return null;
    }
  }
}
