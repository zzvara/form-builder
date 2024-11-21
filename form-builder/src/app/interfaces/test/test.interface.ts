import { Project, ProjectType } from "../project";

export interface Test extends Project {
    type: ProjectType.TEST;
}
