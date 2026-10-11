import { TestBed } from '@angular/core/testing';
import { ComponentService } from './component.service';
import { InstanceOfSectionListPipe } from '../pipes/instance-of-section-list.pipe';
import { InstanceOfFormInputDataPipe } from '../pipes/instance-of-form-input-data.pipe';
import { inputFixture, sectionFixture } from '@app/testing/fixtures';
import { CodeEditorVariableType as T } from '../enums/code-editor.enum';
import type { FormInputData } from '../interfaces/form-input-data';

describe('ComponentService', () => {
  let service: ComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstanceOfSectionListPipe, InstanceOfFormInputDataPipe],
    });
    service = TestBed.inject(ComponentService);
  });

  it('finds top-level and nested inputs and sections', () => {
    const first = inputFixture('first');
    const nested = inputFixture('nested');
    const section = sectionFixture('section', [nested]);
    const edits = [
      { id: 'first', data: first },
      { id: 'section', data: section },
    ];
    service.component$.next(edits);
    expect(service.components()).toBe(edits);
    expect(service.getItemById('first')).toBe(first);
    expect(service.getItemById('section')).toBe(section);
    expect(service.getItemById('nested')).toBe(nested);
    expect(service.getItemById('missing')).toBeUndefined();
    expect(service.getItemsBeforeId('nested')).toEqual([first, section]);
    expect(service.getItemsBeforeId('first')).toEqual([]);
  });

  it('offers only named supported inputs that precede the target', () => {
    const definitions: [FormInputData['type'], T][] = [
      ['InputComponent', T.STRING],
      ['TextareaComponent', T.STRING],
      ['RadioGroupComponent', T.STRING],
      ['NumberInputComponent', T.NUMBER],
      ['CheckboxGroupComponent', T.STRING_ARRAY],
      ['SelectComponent', T.STRING_ARRAY],
      ['DatePickerComponent', T.DATE],
      ['TimePickerComponent', T.DATE],
      ['RangePickerComponent', T.DATE_ARRAY],
    ];
    const inputs = definitions.map(([type], i) =>
      inputFixture(`input-${i}`, { type, customTitle: `answer${i}` }),
    );
    const picture = inputFixture('picture', {
      type: 'PictureInputComponent',
      customTitle: 'photo',
    });
    service.component$.next(
      [...inputs, picture, inputFixture('unnamed'), inputFixture('target')].map((data) => ({
        id: data.data!.id!,
        data,
      })),
    );
    expect(service.getVariableList('target')).toEqual(
      definitions.map(([, type], i) => ({ elementId: `input-${i}`, title: `answer${i}`, type })),
    );
    expect(service.getVariableList('input-0')).toEqual([]);
  });

  it('removes references to deleted and later questions', () => {
    const target = inputFixture('target', {
      codeEditor: {
        enabled: true,
        data: {
          code: 'return true;',
          isValid: true,
          variables: ['first', 'later', 'deleted'].map((elementId) => ({
            elementId,
            title: elementId,
            type: T.STRING,
          })),
        },
      },
    });
    service.component$.next([
      { id: 'first', data: inputFixture('first') },
      { id: 'section', data: sectionFixture('section', [target]) },
      { id: 'later', data: inputFixture('later') },
    ]);
    expect(target.codeEditor.data!.variables.map((v) => v.elementId)).toEqual(['first']);
    service.component$.next([{ id: 'target', data: target }]);
    expect(target.codeEditor.data!.variables).toEqual([]);
  });
  
  it('returns empty collections when no components exist', () => {
    expect(service.getItemsBeforeId('missing')).toEqual([]);
    expect(service.getVariableList('missing')).toEqual([]);
  });

  it('validates section scripts and ignores unsupported imported variable types', () => {
    const first = inputFixture('first', { customTitle: 'First' });
    const unknown = inputFixture('unknown', {
      type: 'UnknownComponent' as FormInputData['type'],
      customTitle: 'Unknown',
    });
    const section = sectionFixture('section');
    section.codeEditor = {
      enabled: true,
      data: {
        code: 'return true;',
        isValid: true,
        variables: [{ elementId: 'first', title: 'First', type: T.STRING }],
      },
    };
    const unsaved = inputFixture('', {
      codeEditor: { enabled: true, data: { code: '', isValid: false, variables: [] } },
    });
    service.component$.next([
      { id: 'first', data: first },
      { id: 'unknown', data: unknown },
      { id: 'section', data: section },
      { id: '', data: unsaved },
    ]);
    expect(section.codeEditor.data!.variables).toHaveSize(1);
    expect(service.getVariableList('section')).toEqual([
      { elementId: 'first', title: 'First', type: T.STRING },
    ]);
    expect(service.getItemsBeforeId('missing')).toEqual([first, unknown, section, unsaved]);
  });
});
