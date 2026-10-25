import { Question, QuestionType } from '@interfaces/question/questions.interface';

export interface SimpleQuestion extends Question {
  type: QuestionType.SIMPLE;
  correct_answer_string: string;
  user_answer_string: string;
}
