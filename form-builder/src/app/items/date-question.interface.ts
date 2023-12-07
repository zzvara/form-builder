import { Question, QuestionType} from './questions.interface';

export interface DateQuestion extends Question {
    type: QuestionType.DATE;
    correct_answers: Date;
    user_answers: Date;
}