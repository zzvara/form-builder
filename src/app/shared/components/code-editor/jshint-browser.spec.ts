declare const JSHINT: typeof import('jshint').JSHINT;

describe('JSHint browser bundle', () => {
  it('accepts valid JavaScript', () => {
    expect(JSHINT('const answer = 42;', { esversion: 6 })).toBeTrue();
  });

  it('reports invalid JavaScript', () => {
    expect(JSHINT('const answer = ;', { esversion: 6 })).toBeFalse();
    expect(JSHINT.errors.length).toBeGreaterThan(0);
  });
});
