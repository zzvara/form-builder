import { FieldLikeInputData } from '@shared/interfaces/field-like-input-data';

export interface NumberInputComponentData extends FieldLikeInputData<number> {
  min: boolean;
  minNumber?: number;
  max: boolean;
  maxNumber?: number;

  stepNumber: number;

  format: boolean;
  formatter?: string;
}
