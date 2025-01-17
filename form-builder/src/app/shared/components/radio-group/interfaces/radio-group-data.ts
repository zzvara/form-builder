import {InputData} from "../../../interfaces/input-data";

export interface RadioGroupData extends InputData<number> {
  required: boolean;
  requiredMessage?: string;

  isButton: boolean;

  options: {
    option_id: number;
    option_description: string; }[];
}
