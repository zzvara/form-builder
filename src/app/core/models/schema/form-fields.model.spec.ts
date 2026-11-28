import { FieldType, isFormField, isFormSection, isRepeatedSection } from './form-fields.model';
import {
  RepeatByMode,
  type RepeatedByCountSection,
  type RepeatedByFieldSection,
  SectionType,
} from './form-section.model';
import {
  createEmptyRepeatedSection,
  createEmptySection,
  createFormComponent,
  createFormField,
} from './schema-initializers';

describe('form-fields type guards', () => {
  it('isFormSection returns true only for section components', () => {
    const standard = createEmptySection();
    const repeated = createEmptyRepeatedSection();

    expect(isFormSection(standard)).toBeTrue();
    expect(isFormSection(repeated)).toBeTrue();

    for (const fieldType of Object.values(FieldType)) {
      expect(isFormSection(createFormField(fieldType))).toBeFalse();
    }
  });

  it('isFormField returns true only for field components', () => {
    for (const fieldType of Object.values(FieldType)) {
      expect(isFormField(createFormField(fieldType))).toBeTrue();
    }

    expect(isFormField(createEmptySection())).toBeFalse();
    expect(isFormField(createEmptyRepeatedSection())).toBeFalse();
  });

  it('partitions every FormComponent into either a section or a field', () => {
    for (const type of [...Object.values(SectionType), ...Object.values(FieldType)]) {
      const component = createFormComponent(type);
      expect(isFormSection(component) !== isFormField(component)).toBeTrue();
    }
  });

  it('isRepeatedSection distinguishes repeated sections from standard sections', () => {
    const standard = createEmptySection();
    const repeatedByCount: RepeatedByCountSection = {
      id: 'rep-1',
      type: SectionType.REPEATED,
      title: 'Count repeated',
      fields: [],
      visibility: [],
      repeatBy: RepeatByMode.NUMBER,
      times: 3,
    };
    const repeatedByField: RepeatedByFieldSection = {
      id: 'rep-2',
      type: SectionType.REPEATED,
      title: 'Field repeated',
      fields: [],
      visibility: [],
      repeatBy: RepeatByMode.FIELD,
      referencedInput: 'count-field-id',
    };

    expect(isRepeatedSection(standard)).toBeFalse();
    expect(isRepeatedSection(repeatedByCount)).toBeTrue();
    expect(isRepeatedSection(repeatedByField)).toBeTrue();
  });
});
