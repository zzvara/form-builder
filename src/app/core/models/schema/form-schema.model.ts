import type { FormField } from './form-fields.model';
import type { FormSection } from './form-section.model';

export type FormComponent = FormField | FormSection;

export interface FormSchema {
  components: FormComponent[];
}
