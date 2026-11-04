import { JavaScriptLinterService } from './javascript-linter.service';

describe('JavaScriptLinterService', () => {
  it('reports diagnostic codes and locations for invalid JavaScript', async () => {
    const errors = await new JavaScriptLinterService().lint('const answer = ;', { esversion: 6 });
    expect(
      errors.some((error) => error.code.startsWith('E') && error.line === 1 && error.character > 0),
    ).toBeTrue();
  });

  it('applies options on each call and preserves previous results', async () => {
    const service = new JavaScriptLinterService();
    const errors = await service.lint('missingName();', { undef: true });
    const snapshot = structuredClone(errors);
    expect(errors.some((error) => error.code === 'W117')).toBeTrue();
    expect(await service.lint('missingName();', { undef: false })).toEqual([]);
    expect(errors).toEqual(snapshot);
  });
});
