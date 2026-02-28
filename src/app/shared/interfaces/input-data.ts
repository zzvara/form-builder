export interface InputData<T = any> {
  id?: string;
  sectionId?: string;
  questionValue?: string;
  descriptionValue?: string;
  defaultValue?: T;
  placeholderValue?: string;
}

export type InputDataKeys<T extends InputData> = keyof T;
