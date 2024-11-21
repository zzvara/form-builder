import { Question, QuestionType} from './questions.interface';

export interface DateQuestion extends Question {
    type: QuestionType.DATE;
    correct_answer_date: Date;
    user_answer_date: Date;
}