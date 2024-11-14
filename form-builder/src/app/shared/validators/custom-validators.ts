import {AbstractControl} from "@angular/forms";

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

  static validateRequiredIf(ifPred: () => boolean) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value = control.value;
        if (!value) {
          return {
            required: true
          }
        }
      }
      return null;
    }
  }

  static validateMinWithMaxIf(maxData: () => [boolean, number], ifPred: () => boolean) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const maxOn = maxData()[0];
        const maxNum = maxData()[1];
        const value: number = control.value;
        const errors: {[key: string]: boolean} = {};
        if (value < 0) {
          errors["minError"] = true;
        }
        if (maxOn && value > maxNum) {
          errors["maxMaxError"] = true;
        }
        if (Object.keys(errors).length > 0) {
          return errors;
        }
      }
      return null;
    }
  }

  static validateMaxWithMinIf(minData: () => [boolean, number], ifPred: () => boolean) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const minOn = minData()[0];
        const minNum = minData()[1];
        const value: number = control.value;
        const errors: {[key: string]: boolean} = {};
        if (value < 1) {
          errors["maxError"] = true;
        }
        if (minOn && value < minNum) {
          errors["maxMaxError"] = true;
        }
        if (Object.keys(errors).length > 0) {
          return errors;
        }
      }
      return null;
    }
  }
}
