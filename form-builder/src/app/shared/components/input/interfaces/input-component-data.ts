import {InputData} from "../../../interfaces/input-data";

export interface InputComponentData extends InputData<string> {
  required: boolean;
  requiredMessage: string;

  minLength: boolean;
  minLengthNumber: number | null;
  minLengthMessage: string;

  maxLength: boolean;
  maxLengthNumber: number | null;

  showCharacterCounter: boolean;
  changeDetection: "change" | "blur";
}
