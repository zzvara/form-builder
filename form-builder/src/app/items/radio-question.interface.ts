import { Question, QuestionType} from './questions.interface';

export interface RadioQuestion extends Question {
    type: QuestionType.RADIO;
    possible_answers: string[];
    correct_answers: string;
    user_answers: string;
}