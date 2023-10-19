import { Questionnaire } from '../items/questionnaire.interface';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class QuestionnaireService {
    private questionnaires: Questionnaire[] = [];
    private questionnaireSubject = new BehaviorSubject<Questionnaire[]>([]);

    //Load data from localStorage
    constructor() { 
        this.loadFromLocalStorage();        
    }

    private loadFromLocalStorage() {
        const savedData = localStorage.getItem('questionnaires');
        if (savedData) {
            this.questionnaires = JSON.parse(savedData);
            this.questionnaireSubject.next([...this.questionnaires]);
        }
    }

    //Save data into localStorage
    private saveToLocalStorage() {
        localStorage.setItem('questionnaires', JSON.stringify(this.questionnaires));
    }

    //Service functions
    list() {
        return this.questionnaireSubject.asObservable();
    }

    add(data: Questionnaire) {
        this.questionnaires.push(data);
        this.questionnaireSubject.next([...this.questionnaires]);
        this.saveToLocalStorage();
    }

    remove(id: string) {
        this.questionnaires = this.questionnaires.filter(q => q.id !== id);
        this.questionnaireSubject.next([...this.questionnaires]);
        this.saveToLocalStorage();
    }

    update(id: string, data: Questionnaire) {
        const index = this.questionnaires.findIndex(q => q.id === id);
        if (index !== -1) {
            this.questionnaires[index] = data;
            this.questionnaireSubject.next([...this.questionnaires]);
            this.saveToLocalStorage();
        }
    }
}