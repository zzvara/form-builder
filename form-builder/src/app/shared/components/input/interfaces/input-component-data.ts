import { FieldLikeInputData } from '@interfaces/field-like-input-data';

export interface InputComponentData extends FieldLikeInputData<string> {
  minLength: boolean;
  minLengthNumber?: number;
  minLengthMessage?: string;

  maxLength: boolean;
  maxLengthNumber?: number;

  showCharacterCounter: boolean;
}
