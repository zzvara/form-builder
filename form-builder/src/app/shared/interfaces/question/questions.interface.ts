export enum QuestionType {
  SIMPLE = 'simple',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
}

export interface Question {
  id: number;
  test_id: number;
  question: string;
  max_point: number;
  user_point: number;
  type: QuestionType;
}
