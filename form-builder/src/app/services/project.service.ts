import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

//HASZNÁLATA: 
// const projectService = new ProjectService<Type>('storageKey');

export class ProjectService<T extends object> {
    private items: T[] = [];
    private itemsSubject = new BehaviorSubject<T[]>([]);

    constructor(private storageKey: string) { 
        this.loadFromLocalStorage();        
    }

    private loadFromLocalStorage() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            this.items = JSON.parse(savedData);
            this.itemsSubject.next([...this.items]);
        }
    }

    private saveToLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }

    private isValidQuestionnaire(data: T): boolean {
        const keys = Object.keys(data) as Array<keyof T>;
    
        return keys.every((key) => {
          const value = data[key];
    
          if (key === 'id') {
            return value !== undefined;
          } else if (key === 'title' || key === 'description' || key === 'date' || key === 'created' || key === 'modified' || key === 'correct_answer_date' || key === 'user_answer_date' || key === 'question' || key === 'user_answer_string' || key === 'correct_answer_string') {
            return typeof value === 'string' && value.trim() !== '';
          } else if (key === 'timeChechkbox') {
            return typeof value === 'boolean';
          } else if (key === 'timeLimit' || key === 'test_id' || key === 'max_point' || key === 'user_point') {
            return typeof value === 'number';
          } else if (key === 'possible_answers' || key === 'correct_answers' || key === 'user_answers') {
            return Array.isArray(value) && value.length > 0;
          }
          return true;
        });
      }

    list() {
        return this.itemsSubject.asObservable();
    }

    add(data: T) {
        this.items.push(data);
        this.itemsSubject.next([...this.items]);
        this.saveToLocalStorage();
    }

    remove(id: number) {
        this.items = this.items.filter((item: any) => item.id !== id);
        this.itemsSubject.next([...this.items]);
        this.saveToLocalStorage();
    }

    update(id: number, data: T) {
        const index = this.items.findIndex((item: any) => item.id === id);
        if (index !== -1) {
            this.items[index] = data;
            this.itemsSubject.next([...this.items]);
            this.saveToLocalStorage();
        }
    }

    addWithCheck(data: T) {
        if(this.isValidQuestionnaire(data)){
            this.items.push(data);
            this.itemsSubject.next([...this.items]);
            this.saveToLocalStorage();
        }else{
            console.error('Invalid data.');
        }
        
    }


    updateWithCheck(id: number, data: T) {
        if (this.isValidQuestionnaire(data)) {
            const index = this.items.findIndex((item: any) => item.id === id);
            if (index !== -1) {
              this.items[index] = data;
              this.itemsSubject.next([...this.items]);
              this.saveToLocalStorage();
            }
        } else {
            console.error('Invalid data.');
        }
    }
}