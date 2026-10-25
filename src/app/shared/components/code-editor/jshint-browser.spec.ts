import { JSHINT } from 'jshint/dist/jshint';

describe('JSHint browser bundle', () => {
  it('accepts valid JavaScript', () => {
    expect(JSHINT('const answer = 42;', { esversion: 6 })).toBeTrue();
  });

  it('reports syntax errors', () => {
    expect(JSHINT('const answer = ;', { esversion: 6 })).toBeFalse();
    expect(JSHINT.errors.some((error) => error?.code.startsWith('E'))).toBeTrue();
  });
});
