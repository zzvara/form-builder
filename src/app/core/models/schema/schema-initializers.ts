import type { FormComponent, FormSchema } from './form-schema.model';
import {
  type StandardSection,
  type RepeatedSection,
  SectionType,
  RepeatByMode,
  type FormSection,
} from './form-section.model';
import {
  DateMode,
  FieldType,
  type FormField,
  type CheckboxField,
  type DateField,
  type ImageField,
  type NumberField,
  type RadioField,
  type RangeField,
  type SelectField,
  type TextboxField,
  type TimeField,
  type TextField,
  type FieldOption,
} from './form-fields.model';
import { v4 as uuidv4 } from 'uuid';

export function createEmptySchema(): FormSchema {
  return {
    id: uuidv4(),
    title: '',
    description: '',
    components: [],
  };
}

export function createEmptySection(): StandardSection {
  return {
    id: uuidv4(),
    type: SectionType.STANDARD,
    title: '',
    fields: [],
    visibility: [],
  };
}

export function createEmptyRepeatedSection(): RepeatedSection {
  return {
    id: uuidv4(),
    type: SectionType.REPEATED,
    title: '',
    repeatBy: RepeatByMode.NUMBER,
    times: 1,
    fields: [],
    visibility: [],
  };
}

export function createTextField(overrides?: Partial<TextField>): TextField {
  return {
    id: uuidv4(),
    type: FieldType.TEXT,
    title: '',
    question: '',
    description: '',
    required: false,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createNumberField(overrides?: Partial<NumberField>): NumberField {
  return {
    id: uuidv4(),
    type: FieldType.NUMBER,
    title: '',
    question: '',
    description: '',
    required: false,
    step: 1,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createDateField(overrides?: Partial<DateField>): DateField {
  return {
    id: uuidv4(),
    type: FieldType.DATE,
    title: '',
    question: '',
    description: '',
    required: false,
    mode: DateMode.FULL,
    format: 'yyyy.MM.dd',
    showTime: false,
    showWeekNumber: false,
    displayInline: false,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createRangeField(overrides?: Partial<RangeField>): RangeField {
  return {
    id: uuidv4(),
    type: FieldType.RANGE,
    title: '',
    question: '',
    description: '',
    required: false,
    mode: DateMode.FULL,
    format: 'yyyy.MM.dd',
    showTime: false,
    showWeekNumber: false,
    displayInline: false,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createTimeField(overrides?: Partial<TimeField>): TimeField {
  return {
    id: uuidv4(),
    type: FieldType.TIME,
    title: '',
    question: '',
    description: '',
    required: false,
    format: 'HH:mm:ss',
    format12: false,
    hideUnavailable: false,
    hourStep: 1,
    minStep: 1,
    secStep: 1,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createTextboxField(overrides?: Partial<TextboxField>): TextboxField {
  return {
    id: uuidv4(),
    type: FieldType.TEXTBOX,
    title: '',
    question: '',
    description: '',
    required: false,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createImageField(overrides?: Partial<ImageField>): ImageField {
  return {
    id: uuidv4(),
    type: FieldType.IMAGE,
    title: '',
    question: '',
    description: '',
    required: false,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createSelectField(overrides?: Partial<SelectField>): SelectField {
  return {
    id: uuidv4(),
    type: FieldType.SELECT,
    title: '',
    question: '',
    description: '',
    required: false,
    options: [
      createFieldOption('Option 1', '1'),
      createFieldOption('Option 2', '2'),
      createFieldOption('Option 3', '3'),
    ],
    multipleAllowed: false,
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createRadioField(overrides?: Partial<RadioField>): RadioField {
  return {
    id: uuidv4(),
    type: FieldType.RADIO,
    title: '',
    question: '',
    description: '',
    required: false,
    options: [
      createFieldOption('Option 1', '1'),
      createFieldOption('Option 2', '2'),
      createFieldOption('Option 3', '3'),
    ],
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createCheckboxField(overrides?: Partial<CheckboxField>): CheckboxField {
  return {
    id: uuidv4(),
    type: FieldType.CHECKBOX,
    title: '',
    question: '',
    description: '',
    required: false,
    options: [
      createFieldOption('Option 1', '1'),
      createFieldOption('Option 2', '2'),
      createFieldOption('Option 3', '3'),
    ],
    validations: [],
    visibility: [],
    ...overrides,
  };
}

export function createOption(label = 'Option', value = ''): FieldOption {
  return {
    label,
    value: value || uuidv4(),
  };
}

export function createFieldOption(label = 'Option', value = ''): FieldOption {
  return {
    label,
    value: value || uuidv4(),
    disabled: false,
  };
}

export function createFormField(type: FieldType): FormField {
  switch (type) {
    case FieldType.TEXT:
      return createTextField();
    case FieldType.NUMBER:
      return createNumberField();
    case FieldType.DATE:
      return createDateField();
    case FieldType.RANGE:
      return createRangeField();
    case FieldType.TIME:
      return createTimeField();
    case FieldType.TEXTBOX:
      return createTextboxField();
    case FieldType.IMAGE:
      return createImageField();
    case FieldType.SELECT:
      return createSelectField();
    case FieldType.RADIO:
      return createRadioField();
    case FieldType.CHECKBOX:
      return createCheckboxField();
    default: {
      const unknown: never = type;
      throw new Error(`Unhandled field type: ${unknown}`);
    }
  }
}

export function createFormSection(type: SectionType): FormSection {
  switch (type) {
    case SectionType.STANDARD:
      return createEmptySection();
    case SectionType.REPEATED:
      return createEmptyRepeatedSection();
    default: {
      const unknown: never = type;
      throw new Error(`Unhandled section type: ${unknown}`);
    }
  }
}

export function createFormComponent(type: FieldType | SectionType): FormComponent {
  if (Object.values(SectionType).includes(type as SectionType)) {
    return createFormSection(type as SectionType);
  }

  return createFormField(type as FieldType);
}
