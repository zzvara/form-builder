import { FormInputData } from '@interfaces/form-input-data';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';

export interface SectionList {
  sectionId: string;
  layout: LayoutEnum;
  reorderEnabled: boolean;
  sectionInputs: FormInputData[];
}
