import { translateComponentType } from '@pages/edit/config/edit-data-config';
import { InputData } from '@interfaces/input-data';

export interface FormInputData<D extends InputData<T> = InputData, T = any> {
  title: string;
  type: keyof typeof translateComponentType;
  data: D | null;
}

export function instanceOfFormInputData(object: any): object is FormInputData {
  return object && 'title' in object && 'type' in object && 'data' in object;
}
