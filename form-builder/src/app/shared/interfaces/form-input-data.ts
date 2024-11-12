import {Type} from "@angular/core";
import {AbstractFormComponent} from "../abstract-classes/abstract-form-component";
import {InputData} from "./input-data";

export interface FormInputData<D extends InputData<T>, T> {
  title: string;
  type: Type<AbstractFormComponent>
  data: D | null;
}
