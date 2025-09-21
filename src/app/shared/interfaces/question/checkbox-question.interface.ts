import { Question, QuestionType } from '@interfaces/question/questions.interface';

// @todo I see a lot of unused interfaces under the `interfaces` folder? Are these just leftovers? Will we need them later? Can we remove them safely?
export interface CheckboxQuestion extends Question {
  type: QuestionType.CHECKBOX;
  possible_answers: string[];
  correct_answers: string[];
  user_answers: string[];
}
