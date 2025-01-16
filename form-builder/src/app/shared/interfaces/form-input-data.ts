import {Type} from "@angular/core";
import {SectionList} from "../../pages/edit/interfaces/section-list";
import {InputData} from "./input-data";
import {FormComponentMarker} from "./form-component-marker";

export interface FormInputData<D extends InputData<T> = InputData, T = any> {
  title: string;
  type: Type<FormComponentMarker>
  data: D | null;
}

export function instanceOfFormInputData(object: any): object is FormInputData {
  return object && 'title' in object && 'type' in object && 'data' in object;
}
