import { IconTypePipe } from './icon-type.pipe';

describe('IconTypePipe', () => {
  const pipe = new IconTypePipe();
  for (const [value, expected] of [
    ['NumberInput', 'number'],
    ['TEXTAREA', 'bold'],
    ['', 'question'],
    ['DatePicker', 'question'],
  ]) {
    it(`maps ${JSON.stringify(value)} to ${expected}`, () =>
      expect(pipe.transform(value)).toBe(expected));
  }
});
