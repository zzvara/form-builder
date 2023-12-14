export enum ProjectType {
  QUESTIONNAIRE = 'questionnaire',
  TEST = 'test',
}

export interface Project {
  id: number;
  title: string;
  description: string;
  type: ProjectType;
  time_chechkbox: boolean;
  time_limit: number;
  date: string;
  created: string;
  modified: string;
}