import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project, ProjectType } from '../items/project.interface';

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

// HASZNÁLATA:
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
    const projectHistory = this.getProjectHistory(projectId);
    const version = projectHistory.find((v) => v.versionNum === versionNum);
    return version ? version.project : undefined;
  }

  revertToVersion(projectId: number, versionNum: number): boolean {
    const projectHistory = this.getProjectHistory(projectId);
    const version = projectHistory.find((v) => v.versionNum === versionNum);

    if (version) {
      const index = this.items.findIndex((item) => item.id === projectId);
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

      const versionNum = this.getProjectVersionCount(id) + 1;
      const projectHistoryKey = `${this.storageKey}-history-${id}`;
      const projectVersion: ProjectVersion<T> = {
        versionNum: versionNum,
        project: previousVersion,
      };

      const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
      projectHistory.push(projectVersion);

      localStorage.setItem(projectHistoryKey, JSON.stringify(projectHistory));

      this.items[index] = data;
      this.items[index].modified = new Date().toISOString().split('T')[0];
      this.itemsSubject.next([...this.items]);
      this.saveToLocalStorage();
      return 0;
    } else {
      return -1;
    }
  }

  searchData(id: number): T[] {
    return this.items.filter((item) => item.id === id);
  }
}
