import { SectionList } from "../pages/edit/interfaces/section-list";

export enum ProjectType {
  QUESTIONNAIRE = 'questionnaire',
  TEST = 'test',
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
  sectionList?: SectionList[];
}

export interface ProjectVersion<T extends Project> {
  versionNum: number;
  project: T;
}
