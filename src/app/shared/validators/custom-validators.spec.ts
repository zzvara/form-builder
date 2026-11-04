import { FormControl, Validators } from '@angular/forms';
import { CustomValidators as V } from './custom-validators';

describe('CustomValidators', () => {
  it('rejects whitespace while leaving absence to required validation', () => {
    expect(V.validateStringNotEmpty(new FormControl(' \t '))).toEqual({ fieldIsEmpty: true });
    for (const value of ['', null, ' answer ']) {
      expect(V.validateStringNotEmpty(new FormControl(value))).toBeNull();
    }
  });

  it('reads updated option lists and length limits', () => {
    const options = ['first'];
    const duplicate = V.validateIsInList(() => options);
    expect(duplicate(new FormControl('second'))).toBeNull();
    options.push('second');
    expect(duplicate(new FormControl('second'))).toEqual({ listContainsItem: 'second' });
    let limit = 3;
    const min = V.minLengthSupplier(() => limit);
    const max = V.maxLengthSupplier(() => limit);
    expect(min(new FormControl(' ab '))).toEqual({ minlength: 3 });
    expect(max(new FormControl(' abc '))).toBeNull();
    expect(max(new FormControl('abcd'))).toEqual({ maxlength: 3 });
    limit = 2;
    expect(min(new FormControl(' ab '))).toBeNull();
    expect(min(new FormControl(null))).toBeNull();
  });

  it('enables required validation only when its condition is active', () => {
    let enabled = false;
    const validate = V.validateRequiredIf(() => enabled);
    expect(validate(new FormControl(''))).toBeNull();
    enabled = true;
    expect(validate(new FormControl(''))).toEqual({ required: true });
    expect(validate(new FormControl('answer'))).toBeNull();
  });

  it('validates numeric bounds, including zero, only when enabled', () => {
    expect(V.validateMinIf(() => true, 1)(new FormControl(0))).toEqual({ minError: true });
    expect(V.validateMaxIf(() => true, -1)(new FormControl(0))).toEqual({ maxError: true });
    expect(V.validateMinIf(() => false, 5)(new FormControl(1))).toBeNull();
    expect(V.validateMaxIf(() => false, 5)(new FormControl(6))).toBeNull();
    expect(V.validateMinPred(() => 2)(new FormControl(2))).toBeNull();
    expect(V.validateMaxPred(() => 2)(new FormControl(2))).toBeNull();
    expect(V.validateMinPred(() => 2)(new FormControl(1))).toEqual({ minError: true });
    expect(V.validateMaxPred(() => 2)(new FormControl(3))).toEqual({ maxError: true });
    expect(V.validateMinPred(() => 2)(new FormControl(null))).toBeNull();
  });

  it('rejects inverted numeric bounds and accepts equal bounds', () => {
    const min = V.validateMinWithMaxIf(
      () => ({ maxOn: true, maxNum: 0 }),
      () => true,
    );
    const max = V.validateMaxWithMinIf(
      () => ({ minOn: true, minNum: 0 }),
      () => true,
    );
    expect(min(new FormControl(1))).toEqual({ minMaxError: 0 });
    expect(max(new FormControl(-1))).toEqual({ maxMinError: 0 });
    expect(min(new FormControl(0))).toBeNull();
    expect(max(new FormControl(0))).toBeNull();
    expect(
      V.validateMinWithMaxIf(
        () => ({ maxOn: false, maxNum: 1 }),
        () => true,
      )(new FormControl(2)),
    ).toBeNull();
    expect(
      V.validateMaxWithMinIf(
        () => ({ minOn: true, minNum: 2 }),
        () => false,
      )(new FormControl(1)),
    ).toBeNull();
  });

  it('compares dates at the configured granularity', () => {
    const bound = new Date(2026, 2, 10, 12);
    const later = new Date(2026, 2, 10, 13);
    const dateData = { maxOn: true, maxDate: bound, mode: 'date' as const, showTime: false };
    const min = V.validateDateMinWithMaxIf(
      () => dateData,
      () => true,
    );
    expect(min(new FormControl(later))).toBeNull();
    dateData.showTime = true;
    expect(min(new FormControl(later))).toEqual({ minMaxError: bound });
    const max = V.validateDateMaxWithMinIf(
      () => ({ minOn: true, minDate: later, mode: 'date', showTime: true }),
      () => true,
    );
    expect(max(new FormControl(bound))).toEqual({ maxMinError: later });
    expect(max(new FormControl(later))).toBeNull();
    const dateOnlyMax = V.validateDateMaxWithMinIf(
      () => ({ minOn: true, minDate: later, mode: 'date', showTime: false }),
      () => true,
    );
    expect(dateOnlyMax(new FormControl(bound))).toBeNull();
  });

  it('compares clock times independently of the calendar date', () => {
    const bound = new Date(2026, 2, 10, 12);
    const later = new Date(2025, 0, 1, 13);
    const min = V.validateTimeMinWithMaxIf(
      () => ({ maxOn: true, maxTime: bound }),
      () => true,
    );
    const max = V.validateTimeMaxWithMinIf(
      () => ({ minOn: true, minTime: later }),
      () => true,
    );
    expect(min(new FormControl(later))).toEqual({ minMaxError: bound });
    expect(max(new FormControl(bound))).toEqual({ maxMinError: later });
    expect(min(new FormControl(bound))).toBeNull();
    expect(max(new FormControl(later))).toBeNull();
  });

  it('checks required substrings only when enabled', () => {
    const validate = V.validateContainsIf(() => true, '{{..}}');
    expect(validate(new FormControl('prefix {{..}}'))).toBeNull();
    expect(validate(new FormControl('prefix'))).toEqual({ containsError: '{{..}}' });
    expect(V.validateContainsIf(() => false, 'x')(new FormControl('y'))).toBeNull();
  });

  it('merges enabled validation errors without calling disabled validators', () => {
    const disabled = jasmine.createSpy('disabled');
    const validate = V.executeValidationsConditionally([
      { condition: () => true, validation: Validators.required },
      { condition: () => true, validation: () => ({ custom: true }) },
      { condition: () => false, validation: disabled },
    ]);
    expect(validate(new FormControl(''))).toEqual({ required: true, custom: true });
    expect(disabled).not.toHaveBeenCalled();
    expect(V.executeValidationsConditionally([])(new FormControl('ok'))).toBeNull();
  });
});
