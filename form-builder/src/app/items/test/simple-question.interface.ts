import { Question, QuestionType} from './questions.interface';

export interface SimpleQuestion extends Question {
    type: QuestionType.SIMPLE;
    correct_answer_string: string;
    user_answer_string: string;
}