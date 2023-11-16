export interface TestQuestion {
    id: number;
    test_id: number;
    question: string;
    correct_answer: string;
    user_answer: string;
    max_point: number;
    user_point: number;
}