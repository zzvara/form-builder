import { Type } from '@angular/core';
import { FormComponentMarker } from '@shared/interfaces/form-component-marker';
import { InputData } from '@shared/interfaces/input-data';

export interface FormInputData<D extends InputData<T> = InputData, T = any> {
  title: string;
  questionPlaceholder?: string;
  descriptionPlaceholder?: string;
  type: Type<FormComponentMarker>;
  data: D | null;
}

export function instanceOfFormInputData(object: any): object is FormInputData {
  return object && 'title' in object && 'type' in object && 'data' in object;
}
