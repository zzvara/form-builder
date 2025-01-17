import { Project, ProjectType } from '@interfaces/project';

export interface Test extends Project {
  type: ProjectType.TEST;
}
