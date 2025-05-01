import { FormInputData } from '@interfaces/form-input-data';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';

export interface SectionList {
  sectionId: string;
  layout: LayoutEnum;
  reorderEnabled: boolean;
  sectionInputs: FormInputData[];
}

export function instanceOfSectionList(object: object | null): object is SectionList {
  return (
    typeof object === 'object' &&
    object !== null &&
    'sectionId' in object &&
    'layout' in object &&
    'sectionInputs' in object
  );
}