import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

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

      return this.isValidJsVariableName(value) ? null : { invalidJsVariableName: true };
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

  private static isValidJsVariableName(name: string): boolean {
    if (!name) {
      return false;
    }

    const reserved = new Set([
      'await',
      'break',
      'case',
      'catch',
      'class',
      'const',
      'continue',
      'debugger',
      'default',
      'delete',
      'do',
      'else',
      'enum',
      'export',
      'extends',
      'false',
      'finally',
      'for',
      'function',
      'if',
      'import',
      'in',
      'instanceof',
      'new',
      'null',
      'return',
      'super',
      'switch',
      'this',
      'throw',
      'true',
      'try',
      'typeof',
      'var',
      'void',
      'while',
      'with',
      'yield',
      'let',
      'static',
      'implements',
      'package',
      'protected',
      'interface',
      'private',
      'public',
    ]);

    if (reserved.has(name)) {
      return false;
    }

    try {
      const idRegex = /^[$_\p{ID_Start}][\p{ID_Continue}\u200C\u200D$]*$/u;
      return idRegex.test(name);
    } catch {
      try {
        new Function(`var ${name};`);
        return true;
      } catch {
        return false;
      }
    }
  }
}
