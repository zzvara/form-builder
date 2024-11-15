export interface ControlConnection {
  [key: string]: ControlConnectionData[]
}

export interface ControlConnectionData {
  name: string,
  recursiveCall?: boolean,
  alreadyCalled?: boolean,
  additionalData?: (() => any)
}
