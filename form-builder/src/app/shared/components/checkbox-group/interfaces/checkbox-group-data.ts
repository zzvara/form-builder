import {InputData} from '@app/shared/interfaces/input-data';

export interface CheckboxGroupData extends InputData<CheckboxOptions[]> {
  required: boolean;
  requiredMessage?: string;
}

export type CheckboxOptions = {
  label: string;
  value: number;
  disabled?: boolean;
  checked?: boolean;
};
