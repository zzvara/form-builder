import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormInput, Project, ProjectType } from '../items/project.interface';

export interface ProjectVersion<T extends Project> {
  versionNum: number;
  project: T;
}

function isQuestionnaireType(project: any): project is Project & { type: ProjectType.QUESTIONNAIRE } {
  return project.type === ProjectType.QUESTIONNAIRE;
}

function isTestType(project: any): project is Project & { type: ProjectType.TEST } {
  return project.type === ProjectType.TEST;
}

@Injectable({
  providedIn: 'root',
})

//HASZNÁLATA:
// const projectService = new ProjectService<Type>();
export class ProjectService<T extends Project> {
  private items: T[] = [];
  private itemsSubject = new BehaviorSubject<T[]>([]);
  private storageKey: string = 'project';

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
      } else if (
        key === 'title' ||
        key === 'description' ||
        key === 'created' ||
        key === 'modified' ||
        key === 'correct_answer_date' ||
        key === 'user_answer_date' ||
        key === 'question' ||
        key === 'user_answer_string' ||
        key === 'correct_answer_string'
      ) {
        return typeof value === 'string' && (value as string).trim() !== '';
      } else if (key === 'time_chechkbox') {
        return typeof value === 'boolean';
      } else if (key === 'time_limit' || key === 'test_id') {
        return typeof value === 'number';
      } else if (key === 'possible_answers') {
        return Array.isArray(value);
      }
      return true;
    });
  }

  private generateNextId(): number {
    if (this.items.length === 0) {
      return 1;
    }

    const ids = this.items.map((item) => item.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
  }

  list() {
    return this.itemsSubject.asObservable();
  }

  add(data: T) {
    const nextId = this.generateNextId();
    data.id = nextId;
    this.items.push(data);
    this.itemsSubject.next([...this.items]);
    this.saveToLocalStorage();
  }

  remove(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
    this.itemsSubject.next([...this.items]);
    this.saveToLocalStorage();
  }

  private updateVersionHistory(projectId: number, project: T) {
    const versionNum = this.getProjectVersionCount(projectId) + 1;
    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    const projectVersion: ProjectVersion<T> = {
      versionNum: versionNum,
      project: project,
    };
    const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
    projectHistory.push(projectVersion);
    localStorage.setItem(projectHistoryKey, JSON.stringify(projectHistory));
  }

  private getProjectVersionCount(projectId: number): number {
    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
    return projectHistory.length;
  }

  getProjectHistory(projectId: number): ProjectVersion<T>[] {
    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
    return projectHistory;
  }

  getProjectVersion(projectId: number, versionNum: number): T | undefined {
    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
    const version = projectHistory.find(v => v.versionNum === versionNum);
    return version ? version.project : undefined;
  }

  revertToVersion(projectId: number, versionNum: number): boolean {
    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
    const version = projectHistory.find(v => v.versionNum === versionNum);
    
    if (version) {
      const index = this.items.findIndex(item => item.id === projectId);
      if (index !== -1) {
        this.items[index] = version.project;
        this.items[index].modified = new Date().toISOString().split('T')[0];
        this.itemsSubject.next([...this.items]);
        this.saveToLocalStorage();
        return true;
      }
    }
    return false;
  }

  update(id: number, data: T): number {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {

      const previousVersion = { ...this.items[index] };
      this.updateVersionHistory(id, previousVersion);

      this.items[index] = data;
      this.items[index].modified = new Date().toISOString().split('T')[0];
      this.itemsSubject.next([...this.items]);
      this.saveToLocalStorage();
      return 0;
    } else {
      return -1;
    }
  }

  addWithCheck(data: T): boolean {
    if (this.isValidData(data)) {
      const nextId = this.generateNextId();
      //   console.log('Generated next ID:', nextId);
      data.id = nextId;
      //   console.log('Setting project ID:', data.id);
      this.items.push(data);
      this.itemsSubject.next([...this.items]);
      this.saveToLocalStorage();
      return true;
    } else {
      console.error('Invalid data.');
      return false;
    }
  }

  updateWithCheck(id: number, data: T): boolean {
    if (this.isValidData(data)) {
      const index = this.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.items[index] = data;
        this.itemsSubject.next([...this.items]);
        this.saveToLocalStorage();
        return true;
      } else {
        return false;
      }
    } else {
      console.error('Invalid data.');
      return false;
    }
  }

  searchData(id: number): T[] {
    return this.items.filter((item) => item.id === id);
  }

  addFormInputToProject(id: number, formInputs: FormInput[]) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      if (!this.items[index].formInputs) {
        this.items[index].formInputs = [];
      }
      this.items[index].formInputs?.push(...formInputs);
      this.items[index].modified = new Date().toISOString().split('T')[0];
      this.itemsSubject.next([...this.items]);
      this.saveToLocalStorage();
    }
  }
}
