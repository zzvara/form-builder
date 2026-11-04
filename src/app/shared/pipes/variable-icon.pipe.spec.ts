import { VariableIconPipe } from './variable-icon.pipe';
import { CodeEditorVariableType as T } from '../enums/code-editor.enum';

describe('VariableIconPipe', () => {
  it('maps the supported variable types and falls back for unknown values', () => {
    const pipe = new VariableIconPipe();
    expect(pipe.transform(T.NUMBER)).toBe('number');
    expect(pipe.transform(T.BOOLEAN)).toBe('bold');
    for (const type of [T.STRING, T.STRING_ARRAY]) expect(pipe.transform(type)).toBe('font-size');
    for (const type of [T.DATE, T.DATE_ARRAY]) expect(pipe.transform(type)).toBe('calendar');
    expect(pipe.transform('unknown' as T)).toBe('question-circle');
  });
});
