import { Question, QuestionType } from '@interfaces/question/questions.interface';

export interface RadioQuestion extends Question {
  type: QuestionType.RADIO;
  possible_answers: string[];
  correct_answer_string: string;
  user_answer_string: string;
}
