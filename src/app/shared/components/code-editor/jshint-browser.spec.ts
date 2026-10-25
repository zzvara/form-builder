import { JSHINT } from 'jshint/dist/jshint';
import { JavaScriptLinterService } from '@services/javascript-linter.service';

describe('JSHint browser bundle', () => {
  it('accepts valid JavaScript', () => {
    expect(JSHINT('const answer = 42;', { esversion: 6 })).toBeTrue();
  });

  it('reports syntax errors', () => {
    expect(JSHINT('const answer = ;', { esversion: 6 })).toBeFalse();
    expect(JSHINT.errors.some((error) => error?.code.startsWith('E'))).toBeTrue();
  });
});

describe('JavaScriptLinterService', () => {
  it('accepts valid JavaScript without a global script', async () => {
    const service = new JavaScriptLinterService();
    expect(await service.lint('const answer = 42;', { esversion: 6 })).toEqual([]);
    expect('JSHINT' in globalThis).toBeFalse();
  });

  it('keeps concurrent editors results separate', async () => {
    const service = new JavaScriptLinterService();
    const [invalid, valid] = await Promise.all([
      service.lint('const answer = ;', { esversion: 6 }),
      service.lint('const answer = 42;', { esversion: 6 }),
    ]);
    expect(invalid.some((error) => error.code.startsWith('E'))).toBeTrue();
    expect(valid).toEqual([]);
  });
});
