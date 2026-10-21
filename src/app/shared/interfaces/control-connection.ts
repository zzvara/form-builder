import type { AbstractControl } from '@angular/forms';

export type ControlConnection = Record<string, ControlConnectionData[]>;

export interface ControlConnectionData {
  name: string;
  recursiveCall?: boolean;
  alreadyCalled?: boolean;
  additionalData?: DataSetterType;
}

export type DataSetterType<Caller = unknown, Value = unknown> = (
  caller: AbstractControl<Caller>,
  currentValue: Value,
) => Value | null;
