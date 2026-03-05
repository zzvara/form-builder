import { FormInputData } from '@interfaces/form-input-data';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';
import { translateComponentType } from '../config/edit-data-config';

export interface SectionList {
  sectionId: string;
  layout: LayoutEnum;
  reorderEnabled: boolean;
  sectionInputs: FormInputData[];
  type: keyof typeof translateComponentType;

  customTitle?: string;
}

export interface RepeatedSectionList extends SectionList {
  repeatByOther: boolean;
  repeatTimes: number | undefined;
  referencableInputs: string[];
  referencedInput: SectionList['customTitle'];
}
