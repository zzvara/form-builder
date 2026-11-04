import { FormControl } from '@angular/forms';
import { getErrorMessageList } from './error-helper';

describe('getErrorMessageList', () => {
  it('returns only matching messages in configuration order', () => {
    const control = new FormControl('', { nonNullable: true });
    control.setErrors({ required: true, minlength: 3, unknown: true });
    expect(
      getErrorMessageList(control, [
        { errorName: 'minlength', errorMessage: 'Too short' },
        { errorName: 'maxlength', errorMessage: 'Too long' },
        { errorName: 'required', errorMessage: 'Required' },
      ]),
    ).toEqual(['Too short', 'Required']);
  });

  it('returns no messages for a valid control', () => {
    expect(
      getErrorMessageList(new FormControl('ok', { nonNullable: true }), [
        { errorName: 'required', errorMessage: 'Required' },
      ]),
    ).toEqual([]);
  });
});
