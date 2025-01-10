import {FormInputData} from "../../../shared/interfaces/form-input-data";
import {SectionList} from "./section-list";

export interface EditList {
  id: string;
  data: SectionList | FormInputData;
}
