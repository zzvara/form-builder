import { Question, QuestionType} from './questions.interface';

export interface CheckboxQuestion extends Question {
    type: QuestionType.CHECKBOX;
    possible_answers: string[];
    correct_answers: string[];
    user_answers: string[];
}