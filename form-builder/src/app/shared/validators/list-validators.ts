import {AbstractControl, FormArray} from "@angular/forms";

export class ListValidators {


  //Form group level validator
  static validateListNum(minNum?: number, maxNum?: number) {
    return (listControl: AbstractControl) => {
      const controls = (listControl as FormArray).controls;
      const error: {
        minLengthError?: {
          min: number,
          current: number
        },
        maxLengthError?: {
          max: number,
          current: number
        }
      } = {};

      if (minNum && controls.length < minNum) {
        error.minLengthError = {
          min: minNum,
          current: controls.length
        };
      }
      if (maxNum && controls.length > maxNum) {
        error.maxLengthError = {
          max: maxNum,
          current: controls.length
        };
      }

      if (Object.keys(error).length > 0) {
        return error;
      }
      return null;
    }
  }

  static validateListContains(item: () => any) {
    return (listControl: AbstractControl) => {
      const controls = (listControl as FormArray).controls;
      if (controls.map(ctrl => ctrl.getRawValue()).some(val => val === item())) {
        return {
          listContainsItem: item()
        };
      }
      return null;
    }
  }
}
