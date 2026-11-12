import type { FormField } from './form-fields.model';
import type { VisibilityRule } from './form-rules.model';

export enum RepeatByMode {
  NUMBER = 'number',
  FIELD = 'field',
}

export enum SectionType {
  STANDARD = 'section',
  REPEATED = 'repeated_section',
}

export interface BaseSection {
  type: SectionType;
  id: string;
  title: string;
  fields: FormField[];
  visibility: VisibilityRule[];
}

export interface StandardSection extends BaseSection {
  type: SectionType.STANDARD;
}

export type RepeatedSection = RepeatedByCountSection | RepeatedByFieldSection;

export interface RepeatedByCountSection extends BaseSection {
  type: SectionType.REPEATED;
  repeatBy: RepeatByMode.NUMBER;
  times: number;
}

export interface RepeatedByFieldSection extends BaseSection {
  type: SectionType.REPEATED;
  repeatBy: RepeatByMode.FIELD;
  referencedInput: string;
}

export type FormSection = StandardSection | RepeatedSection;
