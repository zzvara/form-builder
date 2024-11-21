import {FormInputData} from "../../../shared/interfaces/form-input-data";
import {LayoutEnum} from "./layout-enum";

export interface SectionList {
  sectionId: string,
  layout: LayoutEnum,
  sectionInputs: FormInputData[]
}

export const identifySectionList: (index: number, item: SectionList) => string = (_index, item) => item.sectionId;
export const identifySectionInputs: (index: number, item: FormInputData) => string = (_index, item) => item.data!.id!;
