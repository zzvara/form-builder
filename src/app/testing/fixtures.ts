import type { Project } from '@interfaces/project';
import { ProjectType } from '@interfaces/project';
import type { FormInputData } from '@interfaces/form-input-data';
import type { SectionList } from '@pages/edit/interfaces/section-list';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';

export function projectFixture(overrides: Partial<Project> = {}): Project {
  return {
    id: 'project-1',
    title: 'Survey',
    description: 'A questionnaire',
    type: ProjectType.QUESTIONNAIRE,
    time_checkbox: false,
    deadline_checkbox: false,
    time_limit: 0,
    deadline: '',
    created: '2026-01-01',
    modified: '2026-01-01',
    editList: [],
    ...overrides,
  };
}

export function inputFixture(
  id = 'question-1',
  overrides: Partial<FormInputData> = {},
): FormInputData {
  return {
    title: 'Text',
    type: 'InputComponent',
    data: { id, questionValue: 'Your answer' },
    codeEditor: { enabled: false },
    ...overrides,
  };
}

export function sectionFixture(id = 'section-1', inputs: FormInputData[] = []): SectionList {
  return {
    sectionId: id,
    type: 'SectionComponent',
    layout: LayoutEnum.VERTICAL,
    data: { id, sectionId: id },
    sectionInputs: inputs,
    reorderEnabled: false,
    codeEditor: { enabled: false },
  };
}

export function mockStorage(initial: Record<string, string> = {}): Map<string, string> {
  const values = new Map(Object.entries(initial));
  spyOn(localStorage, 'getItem').and.callFake((key) => values.get(key) ?? null);
  spyOn(localStorage, 'setItem').and.callFake((key, value) => {
    values.set(key, value);
  });
  spyOn(localStorage, 'removeItem').and.callFake((key) => {
    values.delete(key);
  });
  return values;
}
