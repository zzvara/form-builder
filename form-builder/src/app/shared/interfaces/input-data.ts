export interface InputData<T> {
  id?: string;
  sectionId?: string;
  questionValue: string;
  descriptionValue?: string;
  placeholderValue?: string;
  defaultValue?: T;
}

export type InputDataKeys<T extends InputData<any>> = keyof T;
