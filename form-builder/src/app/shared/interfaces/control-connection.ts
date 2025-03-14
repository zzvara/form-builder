import {AbstractControl} from '@angular/forms';

export interface ControlConnection {
  [key: string]: ControlConnectionData[];
}

export interface ControlConnectionData {
  name: string;
  recursiveCall?: boolean;
  alreadyCalled?: boolean;
  additionalData?: DataSetterType;
}

export type DataSetterType<Caller = any, Value = any> = (caller: AbstractControl<Caller>, currentValue: Value) => Value | null;
