import {FormInputData} from "../../../shared/interfaces/form-input-data";
import {LayoutEnum} from "./layout-enum";

export interface SectionList {
  sectionId: string,
  layout: LayoutEnum,
  sectionInputs: FormInputData<any, any>[]
}
