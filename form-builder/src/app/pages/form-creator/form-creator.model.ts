export interface FormCreator {
  id: string;
  name: string;
  description: string;
  timeLimit: number;
  availableUntil: Date;
  createdDate: string;
  modifiedDate: string;
  versions?: FormCreatorVersion[];
}

export interface FormCreatorVersion {
  name: string;
  description: string;
  timeLimit: number;
  availableUntil: Date;
  createdDate: string;
  modifiedDate: string;
  timestamp: number;
}