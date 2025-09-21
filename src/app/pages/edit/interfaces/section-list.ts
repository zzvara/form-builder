import { FormInputData } from '@interfaces/form-input-data';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';

export interface SectionList {
  sectionId: string;
  layout: LayoutEnum;
  reorderEnabled: boolean;
  sectionInputs: FormInputData[];
}

export function instanceOfSectionList(object: any): object is SectionList {
  return object && 'sectionId' in object && 'layout' in object && 'sectionInputs' in object;
}
