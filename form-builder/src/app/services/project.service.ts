import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project , ProjectType} from '../items/project.interface';

function isQuestionnaireType(project: any): project is Project & { type: ProjectType.QUESTIONNAIRE } {
    return project.type === ProjectType.QUESTIONNAIRE;
}

function isTestType(project: any): project is Project & { type: ProjectType.TEST } {
    return project.type === ProjectType.TEST;
}

@Injectable({
    providedIn: 'root'
})

//HASZNÁLATA: 
// const projectService = new ProjectService<Type>();


export class ProjectService<T extends object> {
    private items: T[] = [];
    private itemsSubject = new BehaviorSubject<T[]>([]);
    private storageKey: string = '';

    constructor() {
        const temp = this.items[0];
        if (temp && this.isQuestionnaireType(temp)) {
            this.storageKey = 'questionnaire';
        } else if (temp && this.isTestType(temp)) {
            this.storageKey = 'test';
        }

        this.loadFromLocalStorage();
    }

    private isQuestionnaireType(project: any): project is T & { type: ProjectType.QUESTIONNAIRE } {
        return isQuestionnaireType(project);
    }

    private isTestType(project: any): project is T & { type: ProjectType.TEST } {
        return isTestType(project);
    }

    private loadFromLocalStorage() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            this.items = JSON.parse(savedData) as T[];
            this.itemsSubject.next([...this.items]);
        }
    }

    private saveToLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }

    private isValidData(data: T): boolean {
        const keys = Object.keys(data) as Array<keyof T>;
    
        return keys.every((key) => {
          const value = data[key];
    
          if (key === 'id') {
            return value !== undefined;
          } else if (key === 'title' || key === 'description' || key === 'deadline' || key === 'created' || key === 'modified' || key === 'correct_answer_date' || key === 'user_answer_date' || key === 'question' || key === 'user_answer_string' || key === 'correct_answer_string') {
            return typeof value === 'string' && (value as string).trim() !== '';
          } else if (key === 'time_chechkbox') {
            return typeof value === 'boolean';
          } else if (key === 'time_limit' || key === 'test_id' || key === 'max_point' || key === 'user_point') {
            return typeof value === 'number';
          } else if (key === 'possible_answers' || key === 'correct_answers' || key === 'user_answers') {
            return Array.isArray(value);
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

    update(id: number, data: T): number {
        const index = this.items.findIndex((item: any) => item.id === id);
        if (index !== -1) {
            this.items[index] = data;
            this.itemsSubject.next([...this.items]);
            this.saveToLocalStorage();
            return 0;
        } else {
            return -1;
        }
    }

    addWithCheck(data: T) {
        if(this.isValidData(data)){
            this.items.push(data);
            this.itemsSubject.next([...this.items]);
            this.saveToLocalStorage();
        }else{
            console.error('Invalid data.');
        }
        
    }

    updateWithCheck(id: number, data: T): number {
        if (this.isValidData(data)) {
            const index = this.items.findIndex((item: any) => item.id === id);
            if (index !== -1) {
                this.items[index] = data;
                this.itemsSubject.next([...this.items]);
                this.saveToLocalStorage();
                return 0;
            } else {
                return -1;
            }
        } else {
            console.error('Invalid data.');
            return -1;
        }
    }

    searchData(id: number): T | undefined {
        return this.items.find((item: any) => item.id === id);
    }
}