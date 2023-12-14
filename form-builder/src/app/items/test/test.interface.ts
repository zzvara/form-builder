import { Project, ProjectType} from '../project.interface';

export interface Test extends Project {
    type: ProjectType.TEST;
}