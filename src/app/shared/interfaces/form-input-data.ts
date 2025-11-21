import { translateComponentType } from '@pages/edit/config/edit-data-config';
import { InputData } from '@interfaces/input-data';

export interface FormInputData<D extends InputData<T> = InputData, T = any> {
  title: string;
  questionPlaceholder?: string;
  descriptionPlaceholder?: string;
  type: keyof typeof translateComponentType;
  data: D | null;
}
