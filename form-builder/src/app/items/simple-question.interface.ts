import { Question, QuestionType} from './questions.interface';

export interface SimpleQuestion extends Question {
    type: QuestionType.SIMPLE;
    correct_answers: string;
    user_answers: string;
}