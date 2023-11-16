export enum ProjectType {
    QUESTIONNAIRE = 'questionnaire',
    TEST = 'test',
}

export interface Test {
    id: number;
    title: string;
    description: string;
    type: ProjectType;
    timeChechkbox: boolean;
    timeLimit: number;
    date: string;
    created: string;
    modified: string;
}