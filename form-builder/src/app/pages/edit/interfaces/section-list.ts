import {LayoutEnum} from "./layout-enum";

export interface SectionList {
  sectionId: string,
  layout: LayoutEnum,
  // TODO: Avoid using any type for the formInputs array.
  sectionInputs: any[]
}
