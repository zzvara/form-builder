import {FormInputData} from "@app/shared/interfaces/form-input-data";
import {SectionList} from "@pages/edit/interfaces/section-list";

export interface EditList {
  id: string;
  data: SectionList | FormInputData;
}
