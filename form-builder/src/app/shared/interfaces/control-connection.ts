import {AbstractControl} from "@angular/forms";

export interface ControlConnection {
  [key: string]: ControlConnectionData[]
}

export interface ControlConnectionData {
  name: string,
  recursiveCall?: boolean,
  alreadyCalled?: boolean,
  additionalData?: DataSetterType<any, any>
}

export type DataSetterType<Caller, Value> = (caller: AbstractControl<Caller>, currentValue: Value) => Value | null;
