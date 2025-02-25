import { FormInputData } from "@app/shared/interfaces/form-input-data";
import { LayoutEnum } from "@pages/edit/interfaces/layout-enum";

export interface SectionList {
  sectionId: string;
  layout: LayoutEnum;
  sectionInputs: FormInputData[];
}

export function instanceOfSectionList(object: any): object is SectionList {
  return object && 'sectionId' in object && 'layout' in object && 'sectionInputs' in object;
}
