import type { FormField } from './form-fields.model';
import type { FormSection } from './form-section.model';

/** Represents a string containing HTML/XML from a rich text editor */
export type RichTextString = string;

export type FormComponent = FormField | FormSection;

export interface FormSchema {
  id: string;
  title: string;
  description?: RichTextString;
  components: FormComponent[];
}
