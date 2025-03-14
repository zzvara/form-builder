import { Project, ProjectType } from '@interfaces/project';

export interface Questionnaire extends Project {
  type: ProjectType.QUESTIONNAIRE;
}
