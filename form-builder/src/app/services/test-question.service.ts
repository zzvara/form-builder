import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TestQuestion } from '../items/test-question.interface';

@Injectable({
  providedIn: 'root'
})
export class TestQuestionService {
  private testQuestions: TestQuestion[] = [];
  private testQuestionSubject = new BehaviorSubject<TestQuestion[]>([]);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedData = localStorage.getItem('testQuestions');
    if (savedData) {
      this.testQuestions = JSON.parse(savedData);
      this.testQuestionSubject.next([...this.testQuestions]);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('testQuestions', JSON.stringify(this.testQuestions));
  }

  private isValidTestQuestion(data: TestQuestion): boolean {
    return (
      data.id !== undefined &&
      data.test_id !== undefined &&
      data.question.trim() !== '' &&
      data.correct_answer.trim() !== '' &&
      data.user_answer.trim() !== '' &&
      typeof(data.max_point) === 'number' &&
      typeof(data.user_point) === 'number'
    );
  }

  list() {
    return this.testQuestionSubject.asObservable();
  }

  add(data: TestQuestion) {
    if (this.isValidTestQuestion(data)) {
      this.testQuestions.push(data);
      this.testQuestionSubject.next([...this.testQuestions]);
      this.saveToLocalStorage();
    } else {
      console.error('Invalid test question data.');
    }
  }

  remove(id: number) {
    this.testQuestions = this.testQuestions.filter(q => q.id !== id);
    this.testQuestionSubject.next([...this.testQuestions]);
    this.saveToLocalStorage();
  }

  update(id: number, data: TestQuestion) {
    if (this.isValidTestQuestion(data)) {
      const index = this.testQuestions.findIndex(q => q.id === id);
      if (index !== -1) {
        this.testQuestions[index] = data;
        this.testQuestionSubject.next([...this.testQuestions]);
        this.saveToLocalStorage();
      }
    } else {
      console.error('Invalid test question data.');
    }
  }
}