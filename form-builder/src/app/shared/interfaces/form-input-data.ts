import {Type} from "@angular/core";
import {InputData} from "./input-data";
import {FormComponentMarker} from "./form-component-marker";

export interface FormInputData<D extends InputData<T> = InputData, T = any> {
  title: string;
  type: Type<FormComponentMarker>
  data: D | null;
}
