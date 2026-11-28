import {
  createCheckboxField,
  createCodeEditorVariable,
  createDateField,
  createEmptyRepeatedSection,
  createEmptySchema,
  createEmptySection,
  createFieldOption,
  createFormComponent,
  createFormField,
  createFormSection,
  createImageField,
  createNumberField,
  createOption,
  createRadioField,
  createRangeField,
  createSelectField,
  createTextboxField,
  createTextField,
  createTimeField,
  createVisibilityRule,
} from './schema-initializers';
import { DateMode, FieldType } from './form-fields.model';
import { CodeEditorVariableType } from './form-rules.model';
import { RepeatByMode, SectionType } from './form-section.model';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('schema-initializers', () => {
  describe('createEmptySchema', () => {
    it('creates a schema with an empty components array', () => {
      const first = createEmptySchema();
      const second = createEmptySchema();

      expect(first).toEqual({ components: [] });
      expect(first.components).not.toBe(second.components);
    });
  });

  describe('section initializers', () => {
    it('creates an empty standard section with a unique UUID', () => {
      const first = createEmptySection();
      const second = createEmptySection();

      expect(first.id).toMatch(UUID_V4_REGEX);
      expect(second.id).toMatch(UUID_V4_REGEX);
      expect(first.id).not.toBe(second.id);
      expect(first.type).toBe(SectionType.STANDARD);
      expect(first.title).toBe('');
      expect(first.fields).toEqual([]);
      expect(first.visibility).toEqual([]);
      expect(first.fields).not.toBe(second.fields);
      expect(first.visibility).not.toBe(second.visibility);
    });

    it('creates an empty repeated section defaulting to RepeatByMode.NUMBER and 1 repetition', () => {
      const section = createEmptyRepeatedSection();

      expect(section.id).toMatch(UUID_V4_REGEX);
      expect(section.type).toBe(SectionType.REPEATED);
      expect(section.title).toBe('');
      expect(section.fields).toEqual([]);
      expect(section.visibility).toEqual([]);
      expect(section.repeatBy).toBe(RepeatByMode.NUMBER);
      if (section.repeatBy === RepeatByMode.NUMBER) {
        expect(section.times).toBe(1);
      }
    });
  });

  describe('field initializers', () => {
    const basicFieldFactories = [
      { name: 'createTextField', create: createTextField, expectedType: FieldType.TEXT },
      { name: 'createNumberField', create: createNumberField, expectedType: FieldType.NUMBER },
      { name: 'createDateField', create: createDateField, expectedType: FieldType.DATE },
      { name: 'createRangeField', create: createRangeField, expectedType: FieldType.RANGE },
      { name: 'createTimeField', create: createTimeField, expectedType: FieldType.TIME },
      { name: 'createTextboxField', create: createTextboxField, expectedType: FieldType.TEXTBOX },
      { name: 'createImageField', create: createImageField, expectedType: FieldType.IMAGE },
      { name: 'createSelectField', create: createSelectField, expectedType: FieldType.SELECT },
      { name: 'createRadioField', create: createRadioField, expectedType: FieldType.RADIO },
      {
        name: 'createCheckboxField',
        create: createCheckboxField,
        expectedType: FieldType.CHECKBOX,
      },
    ] as const;

    for (const { name, create, expectedType } of basicFieldFactories) {
      it(`${name} initializes common base properties and fresh arrays`, () => {
        const first = create();
        const second = create();

        expect(first.id).toMatch(UUID_V4_REGEX);
        expect(first.id).not.toBe(second.id);
        expect(first.type).toBe(expectedType);
        expect(first.title).toBe('');
        expect(first.draft).toBeTrue();
        expect(first.question).toBe('');
        expect(first.description).toBe('');
        expect(first.required).toBeFalse();
        expect(first.validations).toEqual([]);
        expect(first.visibility).toEqual([]);
        expect(first.validations).not.toBe(second.validations);
        expect(first.visibility).not.toBe(second.visibility);
      });
    }

    it('initializes type-specific defaults for number, date, range, and time fields', () => {
      const numberField = createNumberField();
      expect(numberField.step).toBe(1);

      const dateField = createDateField();
      expect(dateField.mode).toBe(DateMode.FULL);
      expect(dateField.format).toBe('yyyy.MM.dd');
      expect(dateField.showTime).toBeFalse();
      expect(dateField.showWeekNumber).toBeFalse();
      expect(dateField.displayInline).toBeFalse();

      const rangeField = createRangeField();
      expect(rangeField.mode).toBe(DateMode.FULL);
      expect(rangeField.format).toBe('yyyy.MM.dd');
      expect(rangeField.showTime).toBeFalse();
      expect(rangeField.showWeekNumber).toBeFalse();
      expect(rangeField.displayInline).toBeFalse();

      const timeField = createTimeField();
      expect(timeField.format).toBe('HH:mm:ss');
      expect(timeField.format12).toBeFalse();
      expect(timeField.hideUnavailable).toBeFalse();
      expect(timeField.hourStep).toBe(1);
      expect(timeField.minStep).toBe(1);
      expect(timeField.secStep).toBe(1);
    });

    it('initializes three default options for select, radio, and checkbox fields', () => {
      const expectedOptions = [
        { label: 'Option 1', value: '1', disabled: false },
        { label: 'Option 2', value: '2', disabled: false },
        { label: 'Option 3', value: '3', disabled: false },
      ];

      const selectField = createSelectField();
      expect(selectField.multipleAllowed).toBeFalse();
      expect(selectField.options).toEqual(expectedOptions);

      const radioField = createRadioField();
      expect(radioField.options).toEqual(expectedOptions);

      const checkboxField = createCheckboxField();
      expect(checkboxField.options).toEqual(expectedOptions);

      expect(selectField.options).not.toBe(radioField.options);
    });

    it('applies partial overrides to field initializers', () => {
      const text = createTextField({
        id: 'custom-text-id',
        title: 'Full name',
        draft: false,
        required: true,
        requiredMessage: 'Name is required',
        maxLength: 100,
      });

      expect(text.id).toBe('custom-text-id');
      expect(text.type).toBe(FieldType.TEXT);
      expect(text.title).toBe('Full name');
      expect(text.draft).toBeFalse();
      expect(text.required).toBeTrue();
      expect(text.requiredMessage).toBe('Name is required');
      expect(text.maxLength).toBe(100);

      const select = createSelectField({
        multipleAllowed: true,
        options: [{ label: 'Yes', value: 'yes', disabled: false }],
      });

      expect(select.multipleAllowed).toBeTrue();
      expect(select.options).toEqual([{ label: 'Yes', value: 'yes', disabled: false }]);
    });
  });

  describe('option initializers', () => {
    it('createOption generates a UUID value by default and preserves explicit arguments', () => {
      const defaultOpt = createOption();
      expect(defaultOpt.label).toBe('Option');
      expect(defaultOpt.value).toMatch(UUID_V4_REGEX);
      expect('disabled' in defaultOpt).toBeFalse();

      const customOpt = createOption('Custom Label', 'custom-val');
      expect(customOpt).toEqual({ label: 'Custom Label', value: 'custom-val' });

      const emptyValueOpt = createOption('Generated', '');
      expect(emptyValueOpt.label).toBe('Generated');
      expect(emptyValueOpt.value).toMatch(UUID_V4_REGEX);
    });

    it('createFieldOption sets disabled to false and generates a UUID when value is omitted', () => {
      const defaultOpt = createFieldOption();
      expect(defaultOpt.label).toBe('Option');
      expect(defaultOpt.value).toMatch(UUID_V4_REGEX);
      expect(defaultOpt.disabled).toBeFalse();

      const customOpt = createFieldOption('Choice A', 'a');
      expect(customOpt).toEqual({ label: 'Choice A', value: 'a', disabled: false });
    });
  });

  describe('factory dispatchers', () => {
    it('createFormField creates a field matching every FieldType enum value', () => {
      for (const fieldType of Object.values(FieldType)) {
        const field = createFormField(fieldType);
        expect(field.type).toBe(fieldType);
        expect(field.id).toMatch(UUID_V4_REGEX);
      }
    });

    it('createFormField throws on an unhandled field type', () => {
      expect(() => createFormField('unknown_field' as FieldType)).toThrowError(
        'Unhandled field type: unknown_field',
      );
    });

    it('createFormSection creates a section matching every SectionType enum value', () => {
      const standard = createFormSection(SectionType.STANDARD);
      expect(standard.type).toBe(SectionType.STANDARD);

      const repeated = createFormSection(SectionType.REPEATED);
      expect(repeated.type).toBe(SectionType.REPEATED);
    });

    it('createFormSection throws on an unhandled section type', () => {
      expect(() => createFormSection('unknown_section' as SectionType)).toThrowError(
        'Unhandled section type: unknown_section',
      );
    });

    it('createFormComponent dispatches both SectionType and FieldType values', () => {
      for (const sectionType of Object.values(SectionType)) {
        const component = createFormComponent(sectionType);
        expect(component.type).toBe(sectionType);
      }

      for (const fieldType of Object.values(FieldType)) {
        const component = createFormComponent(fieldType);
        expect(component.type).toBe(fieldType);
      }
    });
  });

  describe('rule initializers', () => {
    it('createVisibilityRule initializes defaults and accepts overrides', () => {
      const rule = createVisibilityRule();
      expect(rule.id).toMatch(UUID_V4_REGEX);
      expect(rule.enabled).toBeFalse();
      expect(rule.code).toBe('');
      expect(rule.variables).toEqual([]);

      const variable = createCodeEditorVariable('field-1', 'Age', CodeEditorVariableType.NUMBER);
      const customRule = createVisibilityRule({
        id: 'rule-1',
        enabled: true,
        code: 'return Age >= 18;',
        variables: [variable],
      });

      expect(customRule).toEqual({
        id: 'rule-1',
        enabled: true,
        code: 'return Age >= 18;',
        variables: [variable],
      });
    });

    it('createCodeEditorVariable defaults type to STRING and supports explicit types', () => {
      expect(createCodeEditorVariable('el-1', 'Name')).toEqual({
        elementId: 'el-1',
        title: 'Name',
        type: CodeEditorVariableType.STRING,
      });

      expect(createCodeEditorVariable('el-2', 'Dates', CodeEditorVariableType.DATE_ARRAY)).toEqual({
        elementId: 'el-2',
        title: 'Dates',
        type: CodeEditorVariableType.DATE_ARRAY,
      });
    });
  });
});
