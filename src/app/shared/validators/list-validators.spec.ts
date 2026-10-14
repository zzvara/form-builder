import { FormArray, FormControl } from '@angular/forms';
import { ListValidators } from './list-validators';

describe('ListValidators', () => {
  const list = (...values: string[]) =>
    new FormArray(values.map((value) => new FormControl(value)));

  it('enforces inclusive minimum and maximum lengths', () => {
    const validate = ListValidators.validateListNum(1, 2);
    expect(validate(list())).toEqual({ minLengthError: { min: 1, current: 0 } });
    expect(validate(list('a'))).toBeNull();
    expect(validate(list('a', 'b'))).toBeNull();
    expect(validate(list('a', 'b', 'c'))).toEqual({ maxLengthError: { max: 2, current: 3 } });
  });

  it('allows an unspecified bound and enforces a maximum of zero', () => {
    expect(ListValidators.validateListNum()(list('a'))).toBeNull();
    expect(ListValidators.validateListNum(undefined, 0)(list('a'))).toEqual({
      maxLengthError: { max: 0, current: 1 },
    });
  });

  it('uses the current supplied item when checking duplicates', () => {
    let value = 'a';
    const validate = ListValidators.validateListContains(() => value);
    expect(validate(list('a', 'b'))).toEqual({ listContainsItem: 'a' });
    value = 'c';
    expect(validate(list('a', 'b'))).toBeNull();
  });
});
