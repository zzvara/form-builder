import type { ValidationRule, VisibilityRule } from './form-rules.model';
import type { FormComponent, RichTextString } from './form-schema.model';
import { type FormSection, type RepeatedSection, SectionType } from './form-section.model';

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  RANGE = 'range',
  TIME = 'time',
  TEXTBOX = 'textbox',
  IMAGE = 'image',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
}

export enum DateMode {
  FULL = 'full',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  DECADE = 'decade',
}

export interface BaseField {
  id: string;
  title: string;
  type: FieldType;
  question: string;
  description?: RichTextString;
  sectionId?: string;
  placeholder?: string;
  required: boolean;
  requiredMessage?: string;
  tooltip?: string;
  validations: ValidationRule[];
  visibility: VisibilityRule[];
}

export interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TextField extends BaseField {
  type: FieldType.TEXT;
  default?: string;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  showCharacterCounter?: boolean;
}

export interface NumberField extends BaseField {
  type: FieldType.NUMBER;
  min?: number;
  max?: number;
  step?: number;
  default?: number;
  format?: string;
}

export interface DateField extends BaseField {
  type: FieldType.DATE;
  default?: string;
  mode: DateMode;
  format: string;
  showTime: boolean;
  timeFormat?: string;
  showWeekNumber: boolean;
  displayInline: boolean;
  min?: string;
  max?: string;
}

export type DateRange = [string, string];

export interface RangeField extends BaseField {
  type: FieldType.RANGE;
  default?: DateRange;
  mode: DateMode;
  format: string;
  showTime: boolean;
  timeFormat?: string;
  showWeekNumber: boolean;
  displayInline: boolean;
  min?: string;
  max?: string;
}

export interface TimeField extends BaseField {
  type: FieldType.TIME;
  default?: string;
  format: string;
  format12: boolean;
  hideUnavailable: boolean;
  hourStep: number;
  minStep: number;
  secStep: number;
  min?: string;
  max?: string;
}

export interface TextboxField extends BaseField {
  type: FieldType.TEXTBOX;
  default?: string;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  showCharacterCounter?: boolean;
}

export interface ImageField extends BaseField {
  type: FieldType.IMAGE;
}

export interface SelectField extends BaseField {
  type: FieldType.SELECT;
  options: FieldOption[];
  default?: FieldOption[];
  multipleAllowed: boolean;
}

export interface RadioField extends BaseField {
  type: FieldType.RADIO;
  options: FieldOption[];
  default?: FieldOption;
  isButton?: boolean;
}

export interface CheckboxField extends BaseField {
  type: FieldType.CHECKBOX;
  options: FieldOption[];
  default?: FieldOption[];
}

export function isFormSection(component: FormComponent): component is FormSection {
  return Object.values(SectionType).includes(component.type as SectionType);
}

export function isFormField(component: FormComponent): component is FormField {
  return Object.values(FieldType).includes(component.type as FieldType);
}

export function isRepeatedSection(section: FormSection): section is RepeatedSection {
  return section.type === SectionType.REPEATED;
}

export type FormField =
  | TextField
  | NumberField
  | DateField
  | RangeField
  | TimeField
  | TextboxField
  | ImageField
  | SelectField
  | RadioField
  | CheckboxField;
