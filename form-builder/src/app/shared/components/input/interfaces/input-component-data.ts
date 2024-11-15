import {FieldLikeInputData} from "../../../interfaces/field-like-input-data";

export interface InputComponentData extends FieldLikeInputData<string> {
  minLength: boolean;
  minLengthNumber: number | null;
  minLengthMessage?: string;

  maxLength: boolean;
  maxLengthNumber: number | null;

  showCharacterCounter: boolean;
}

export interface InputComponentEditData extends InputComponentData {
  setDefaultValue: boolean;
}
