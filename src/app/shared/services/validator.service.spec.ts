import { FormControl } from '@angular/forms';
import { ValidatorService } from './validator.service';

describe('ValidatorService', () => {
  for (const name of ['answer', '_answer2', '$total']) {
    it(`accepts the JavaScript identifier ${name}`, () => {
      expect(ValidatorService.isValidJsVariableName(name)).toBeNull();
    });
  }

  for (const name of ['2answer', 'first name', 'a-b', 'let', 'window', 'document', 'eval', '']) {
    it(`rejects the invalid or reserved identifier ${JSON.stringify(name)}`, () => {
      expect(ValidatorService.isValidJsVariableName(name)).toEqual({ invalidJsVariableName: true });
    });
  }

  it('trims names and allows empty/reset controls to use the required validator', () => {
    const validate = ValidatorService.validVariableNameValidator();
    expect(validate(new FormControl(' answer '))).toBeNull();
    expect(validate(new FormControl(' '))).toBeNull();
    expect(validate(new FormControl(null))).toBeNull();
  });
  
  it('detects duplicate names after trimming without ignoring case', () => {
    const validate = ValidatorService.uniqueNameValidator(['answer']);
    expect(validate(new FormControl(' answer '))).toEqual({ notUnique: true });
    expect(validate(new FormControl('Answer'))).toBeNull();
    expect(validate(new FormControl(null))).toBeNull();
  });
});
