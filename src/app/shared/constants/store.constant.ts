import { ProjectType } from "../interfaces/project";

export const INITIAL_FORM = {
        title: '',
        description: '',
        type: ProjectType.QUESTIONNAIRE,
        time_checkbox: false,
        deadline_checkbox: false,
        time_limit: 0,
        deadline: '',
        created: new Date().toISOString().split('T')[0],
        modified: new Date().toISOString().split('T')[0],
        isComponentsValid: false
      };