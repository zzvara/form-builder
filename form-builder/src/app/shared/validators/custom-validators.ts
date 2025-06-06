import { AbstractControl, ValidatorFn } from '@angular/forms';
import { compareTimeFull, defaultDateComparers } from '@helpers/date-helper';
import { NzDateMode } from 'ng-zorro-antd/date-picker';

export class CustomValidators {
  static validateStringNotEmpty(control: AbstractControl) {
    const value = control.value as string;
    if (value && value.trim().length === 0) {
      return {
        fieldIsEmpty: true,
      };
    }
    return null;
  }

  static validateIsInList(list: () => any[]) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (list().some((val) => val === value)) {
        return {
          listContainsItem: value,
        };
      }
      return null;
    };
  }

  static minLengthSupplier(minSupplier: () => number) {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (value && value.trim().length < minSupplier()) {
        return {
          minlength: minSupplier(),
        };
      }
      return null;
    };
  }

  static maxLengthSupplier(maxSupplier: () => number) {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (value && value.trim().length > maxSupplier()) {
        return {
          maxlength: maxSupplier(),
        };
      }
      return null;
    };
  }

  static validateRequiredIf(ifPred: () => boolean) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value = control.value;
        if (!value) {
          return {
            required: true,
          };
        }
      }
      return null;
    };
  }

  static validateMinIf(ifPred: () => boolean, min: number) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value: number = control.value;
        if (value && value < min) {
          return {
            minError: true,
          };
        }
      }
      return null;
    };
  }

  static validateMinPred(min: () => number) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && value < min()) {
        return {
          minError: true,
        };
      }
      return null;
    };
  }

  static validateMinWithMaxIf(maxData: () => { maxOn: boolean; maxNum: number }, ifPred: () => boolean) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && ifPred()) {
        if (maxData().maxOn && maxData().maxNum && value > maxData().maxNum) {
          return {
            minMaxError: maxData().maxNum,
          };
        }
      }
      return null;
    };
  }

  static validateDateMinWithMaxIf(
    maxData: () => { maxOn: boolean; maxDate: Date; mode: NzDateMode; showTime: boolean },
    ifPred: () => boolean
  ) {
    return (control: AbstractControl) => {
      const value: Date = control.value;
      if (value && ifPred()) {
        if (
          maxData().maxOn &&
          maxData().maxDate &&
          defaultDateComparers[maxData().showTime ? 'time' : maxData().mode](value, maxData().maxDate) > 0
        ) {
          return {
            minMaxError: maxData().maxDate,
          };
        }
      }
      return null;
    };
  }

  static validateTimeMinWithMaxIf(maxData: () => { maxOn: boolean; maxTime: Date }, ifPred: () => boolean) {
    return (control: AbstractControl) => {
      const value: Date = control.value;
      if (value && ifPred()) {
        if (maxData().maxOn && maxData().maxTime && compareTimeFull(value, maxData().maxTime) > 0) {
          return {
            minMaxError: maxData().maxTime,
          };
        }
      }
      return null;
    };
  }

  static validateMaxIf(ifPred: () => boolean, max: number) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value: number = control.value;
        if (value && value > max) {
          return {
            maxError: true,
          };
        }
      }
      return null;
    };
  }

  static validateMaxPred(max: () => number) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && value > max()) {
        return {
          maxError: true,
        };
      }
      return null;
    };
  }

  static validateMaxWithMinIf(minData: () => { minOn: boolean; minNum: number }, ifPred: () => boolean) {
    return (control: AbstractControl) => {
      const value: number = control.value;
      if (value && ifPred()) {
        if (minData().minOn && minData().minNum && value < minData().minNum) {
          return {
            maxMinError: minData().minNum,
          };
        }
      }
      return null;
    };
  }

  static validateDateMaxWithMinIf(
    minData: () => { minOn: boolean; minDate: Date; mode: NzDateMode; showTime: boolean },
    ifPred: () => boolean
  ) {
    return (control: AbstractControl) => {
      const value: Date = control.value;
      if (value && ifPred()) {
        if (
          minData().minOn &&
          minData().minDate &&
          defaultDateComparers[minData().showTime ? 'time' : minData().mode](value, minData().minDate) < 0
        ) {
          return {
            maxMinError: minData().minDate,
          };
        }
      }
      return null;
    };
  }

  static validateTimeMaxWithMinIf(minData: () => { minOn: boolean; minTime: Date }, ifPred: () => boolean) {
    return (control: AbstractControl) => {
      const value: Date = control.value;
      if (value && ifPred()) {
        if (minData().minOn && minData().minTime && compareTimeFull(value, minData().minTime) < 0) {
          return {
            maxMinError: minData().minTime,
          };
        }
      }
      return null;
    };
  }

  static validateContainsIf(ifPred: () => boolean, contains: string) {
    return (control: AbstractControl) => {
      if (ifPred()) {
        const value: string = control.value;
        if (value && !value.includes(contains)) {
          return {
            containsError: contains,
          };
        }
      }
      return null;
    };
  }

  static executeValidationsConditionally(validationConditions: { condition: () => boolean; validation: ValidatorFn }[]) {
    return (control: AbstractControl) => {
      const errors: { [key: string]: string } = {};
      validationConditions.forEach((vc) => {
        if (vc.condition()) {
          const error = vc.validation(control);
          if (error) {
            Object.keys(error).forEach((key) => {
              errors[key] = error[key];
            });
          }
        }
      });
      if (Object.keys(errors).length > 0) {
        return errors;
      }
      return null;
    };
  }
}
