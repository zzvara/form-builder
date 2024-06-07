import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project, ProjectVersion } from '../items/project.interface';

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
    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      this.items = JSON.parse(savedData) as T[];
      this.itemsSubject.next([...this.items]);
    }
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
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  remove(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
    this.itemsSubject.next([...this.items]);
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
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
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        return true;
      }
    }
    return false;
  }

  update(id: number, data: T): number {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      const previousVersion = { ...this.items[index] };

      const projectHistoryKey = `${this.storageKey}-history-${id}`;
      const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
      const versionNum = projectHistory.length + 1;

      const projectVersion: ProjectVersion<T> = {
        versionNum: versionNum,
        project: previousVersion,
      };

      projectHistory.push(projectVersion);

      localStorage.setItem(projectHistoryKey, JSON.stringify(projectHistory));

      this.items[index] = data;
      this.items[index].modified = new Date().toISOString().split('T')[0];
      this.itemsSubject.next([...this.items]);
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      return 0;
    } else {
      return -1;
    }
  }

  searchData(id: number): T[] {
    return this.items.filter((item) => item.id === id);
  }
}
