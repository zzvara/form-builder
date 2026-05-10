import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { forbiddenGlobalNames, javascriptKeywords } from '../constants/javascript-keywords.constants';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  static validVariableNameValidator() {
    return (control: AbstractControl) => {
      const value = control.value.trim() ?? '';

      if (!value) {
        return null;
      }

      return this.isValidJsVariableName(value);
    };
  }

  static uniqueNameValidator(names: string[]) {
    return (control: AbstractControl) => {
      const value = control.value.trim() ?? '';

      if (!value) {
        return null;
      }

      return names.includes(value) ? { notUnique: true } : null;
    };
  }

  static isValidJsVariableName(variableName: string) {
    if (!/^[$A-Z_][0-9A-Z_$]*$/i.test(variableName)) {
      return { invalidJsVariableName: true };
    }

    if (javascriptKeywords.has(variableName)) {
      return { invalidJsVariableName: true };
    }

    if (forbiddenGlobalNames.has(variableName)) {
      return { invalidJsVariableName: true };
    }

    if (variableName in globalThis) {
      return { invalidJsVariableName: true };
    }
    try {
      new Function(`let ${variableName} = 1;`);
    } catch {
      return { invalidJsVariableName: true };
    }

    return null;
  }
}
