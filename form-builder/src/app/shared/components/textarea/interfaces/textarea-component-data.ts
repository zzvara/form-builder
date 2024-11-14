import {InputData} from "../../../interfaces/input-data";

export interface TextareaComponentData extends InputData<string>{
  changeDetection: "change" | "blur";
}
