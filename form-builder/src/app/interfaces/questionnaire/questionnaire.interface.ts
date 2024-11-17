import { Project, ProjectType } from "src/app/interfaces/project";

export interface Questionnaire extends Project {
    type: ProjectType.QUESTIONNAIRE;
}