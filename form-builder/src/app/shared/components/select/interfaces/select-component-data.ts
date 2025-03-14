import { FieldLikeInputData } from '@interfaces/field-like-input-data';

export interface SelectComponentData extends FieldLikeInputData<string | string[]> {
  selectOptions: string[];
  isMultipleChoice: boolean;
}
