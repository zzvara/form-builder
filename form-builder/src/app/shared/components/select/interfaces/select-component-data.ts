import {InputData} from "../../../interfaces/input-data";

export interface SelectComponentData extends InputData<string | string[]>{
  selectOptions: string[];
  isMultipleChoice: boolean;
  changeDetection: "change" | "blur";
}
