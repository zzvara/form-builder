import {InputData} from "./input-data";

export interface FieldLikeInputData<T> extends InputData<T> {
  placeholderValue?: string;

  required: boolean;
  requiredMessage?: string;

  showTooltip: boolean;
  tooltipText?: string;
}
