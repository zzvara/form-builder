import type { InputData } from '@interfaces/input-data';

export interface CheckboxGroupData extends InputData<CheckboxOptions[]> {
  required: boolean;
  requiredMessage?: string;
}

export interface CheckboxOptions {
  label: string;
  value: number;
  disabled?: boolean;
  checked?: boolean;
}
