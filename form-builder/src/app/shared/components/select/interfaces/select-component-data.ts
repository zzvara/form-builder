import {FieldLikeInputData} from '@shared/interfaces/field-like-input-data';

export interface SelectComponentData extends FieldLikeInputData<string | string[]> {
  selectOptions: string[];
  isMultipleChoice: boolean;
}
