import { Test } from '../items/test.interface';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class TestService {
    private tests: Test[] = [];
    private testSubject = new BehaviorSubject<Test[]>([]);

    constructor() { 
        this.loadFromLocalStorage();        
    }

    private loadFromLocalStorage() {
        const savedData = localStorage.getItem('tests');
        if (savedData) {
            this.tests = JSON.parse(savedData);
            this.testSubject.next([...this.tests]);
        }
    }

    private saveToLocalStorage() {
        localStorage.setItem('tests', JSON.stringify(this.tests));
    }

    private isValidTest(data: Test): boolean {
        return (
          data.id !== undefined &&
          data.title.trim() !== '' &&
          data.description.trim() !== '' &&
          typeof(data.timeChechkbox) === 'boolean' &&
          typeof(data.timeLimit) === 'number' &&
          data.date.trim() !== '' &&
          data.created.trim() !== '' &&
          data.modified.trim() !== ''
        );
    }

    list() {
        return this.testSubject.asObservable();
    }

    add(data: Test) {
        if(this.isValidTest(data)){
            this.tests.push(data);
            this.testSubject.next([...this.tests]);
            this.saveToLocalStorage();
        }else{
            console.error('Invalid test data.');
        }
        
    }

    remove(id: number) {
        this.tests = this.tests.filter(q => q.id !== id);
        this.testSubject.next([...this.tests]);
        this.saveToLocalStorage();
    }

    update(id: number, data: Test) {
        if (this.isValidTest(data)) {
            const index = this.tests.findIndex(q => q.id === id);
            if (index !== -1) {
              this.tests[index] = data;
              this.testSubject.next([...this.tests]);
              this.saveToLocalStorage();
            }
        } else {
            console.error('Invalid test data.');
        }
    }
}