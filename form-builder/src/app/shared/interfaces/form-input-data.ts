import { translateComponentType } from '@pages/edit/config/edit-data-config';
import { InputData } from '@interfaces/input-data';

export interface FormInputData<D extends InputData<T> = InputData, T = string | number | boolean | null> {
  title: string;
  questionPlaceholder?: string;
  descriptionPlaceholder?: string;
  type: keyof typeof translateComponentType;
  data: D | null;
}

export function instanceOfFormInputData<
  D extends InputData<T>,
  T = string | number | boolean | null 
>(object: object | null): object is FormInputData<D, T> {
  return object != null &&
    'title' in object &&
    'type' in object &&
    'data' in object;
}

