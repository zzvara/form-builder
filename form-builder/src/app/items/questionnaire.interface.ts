export enum ProjectType {
    QUESTIONNAIRE = 'questionnaire',
    TEST = 'test',
  }

export interface Questionnaire {
    id: number;
    title: string;
    description: string;
    type: ProjectType;
    timeChechkbox: boolean;
    limit: boolean;
    timeLimit: number;
    date: string;
    created: string;
    modified: string;
}