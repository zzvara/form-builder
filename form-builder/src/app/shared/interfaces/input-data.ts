export interface InputData<T> {
  id?: string;
  sectionId?: string;

  questionValue: string;
  descriptionValue: string;
  placeholderValue: string;
  defaultValue?: T;
}
