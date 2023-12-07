export enum ProjectType {
  QUESTIONNAIRE = 'questionnaire',
  TEST = 'test',
}

export interface Project {
  id: number;
  title: string;
  description: string;
  type: ProjectType;
  timeChechkbox: boolean;
  timeLimit: number;
  date: string;
  created: string;
  modified: string;
}