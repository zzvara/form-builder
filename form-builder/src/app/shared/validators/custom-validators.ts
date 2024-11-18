import {AbstractControl, ValidatorFn} from "@angular/forms";

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

  static minLengthSupplier(minSupplier: () => number) {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (value && value.trim().length < minSupplier()) {
        return {
          minlength: minSupplier()
        };
      }
      return null;
    }
  }

  static maxLengthSupplier(maxSupplier: () => number) {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (value && value.trim().length > maxSupplier()) {
        return {
          maxlength: maxSupplier()
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

  static validateMinIf(ifPred: () => boolean, min: number) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value: number = control.value;
        if (value && value < min) {
          return {
            minError: true
          }
        }
      }
      return null;
    }
  }

  static validateMinPred(min: () => number) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && value < min()) {
        return {
          minError: true
        }
      }
      return null;
    }
  }

  static validateMinWithMaxIf(maxData: () => [boolean, number], ifPred: () => boolean) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && ifPred()) {
        const maxOn = maxData()[0];
        const maxNum = maxData()[1];
        if (maxOn && maxNum && value > maxNum) {
          return {
            minMaxError: maxNum
          };
        }
      }
      return null;
    }
  }

  static validateMaxIf(ifPred: () => boolean, max: number) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value: number = control.value;
        if (value && value > max) {
          return {
            maxError: true
          }
        }
      }
      return null;
    }
  }

  static validateMaxPred(max: () => number) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && value > max()) {
        return {
          maxError: true
        }
      }
      return null;
    }
  }

  static validateMaxWithMinIf(minData: () => [boolean, number], ifPred: () => boolean) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && ifPred()) {
        const minOn = minData()[0];
        const minNum = minData()[1];
        if (minOn && minNum && value < minNum) {
          return {
            maxMinError: minNum
          }
        }
      }
      return null;
    }
  }

  static validateContainsIf(ifPred: () => boolean, contains: string) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value: string = control.value;
        if (value && !value.includes(contains)) {
          return {
            containsError: contains
          }
        }
      }
      return null;
    }
  }

  static executeValidationsConditionally(validationConditions: {condition: () => boolean, validation: ValidatorFn}[]) {
    return (control: AbstractControl) => {
      const errors: {[key: string]: any} = {};
      validationConditions.forEach(vc => {
        if (vc.condition()) {
          const error = vc.validation(control);
          if (error) {
            Object.keys(error).forEach(key => {
              errors[key] = error[key];
            });
          }
        }
      });
      if (Object.keys(errors).length > 0) {
        return errors;
      }
      return null;
    }
  }
}