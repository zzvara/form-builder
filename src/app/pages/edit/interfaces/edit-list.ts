import type { FormInputData } from '@interfaces/form-input-data';
import type { SectionList } from '@pages/edit/interfaces/section-list';

export interface EditList {
  id: string;
  data: SectionList | FormInputData;
}
