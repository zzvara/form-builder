import { Project, ProjectType} from '../project.interface';

export interface Questionnaire extends Project {
    type: ProjectType.QUESTIONNAIRE;
}