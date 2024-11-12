import { Question } from './question/questions.interface';

export enum ProjectType {
  QUESTIONNAIRE = 'questionnaire',
  TEST = 'test',
}

export interface FormInput {
  component: string;
  type?: string;
  id: string;
  sectionId: string;
  question: string;
  answer: string;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  type: ProjectType;
  time_checkbox: boolean;
  deadline_checkbox: boolean;
  time_limit: number;
  deadline: string;
  created: string;
  modified: string;
  formInputs?: FormInput[];
}

export interface ProjectVersion<T extends Project> {
  versionNum: number;
  project: T;
}
