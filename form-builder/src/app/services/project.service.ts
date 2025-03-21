import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project, ProjectVersion } from '@app/interfaces/project';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})

/**
 * This service provides functionality to manage a collection of projects.
 * Projects are generic, allowing for flexibility in the types of projects managed.
 */
export class ProjectService<T extends Project> {
  private items: T[] = []; // Holds the current list of projects
  private itemsSubject = new BehaviorSubject<T[]>([]);
  private storageKey: string = 'project';

  constructor() {
    // Attempt to load saved projects from local storage
    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      this.items = JSON.parse(savedData) as T[];
      this.itemsSubject.next([...this.items]);
    }
  }

    /**
   * Generates a unique ID for a new project using UUID.
   * @returns {string} - The generated UUID.
   */
    private generateNextId(): string {
      return uuidv4();
    }
  

  /**
   * This method returns an observable that emits the current list of projects.
   * It allows subscribers to reactively receive updates when the project list changes.
   * @returns {Observable<T[]>} An observable of the current list of projects.
   */
  list(): Observable<T[]> {
    return this.itemsSubject.asObservable();
  }

  /**
   * Adds a new project to the list and persists the updated list to local storage.
   * It assigns a new unique ID to the project, updates the internal list and the observable,
   * and then updates the local storage with the new list of projects.
   * @param {T} data - The project data to add.
   * @returns {void}
   */
  add(data: T): void {
    data.id = this.generateNextId();
    this.items.push(data);
    this.itemsSubject.next([...this.items]);
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  /**
   * Removes a project by its ID from the list and updates local storage.
   * It also removes the project's history from local storage.
   * It filters out the project with the given ID from the internal list, updates the observable,
   * and persists the updated list to local storage.
   * @param {number} id - The ID of the project to remove.
   * @returns {void}
   */
  remove(projectId: string): void {
    // Remove the project from the list
    this.items = this.items.filter((item) => item.id !== projectId);
    this.itemsSubject.next([...this.items]);
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));

    // Remove the project's history from local storage
    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    localStorage.removeItem(projectHistoryKey);
  }

  /**
   * Retrieves the history of versions for a specific project from local storage.
   * It constructs a unique key for the project's history based on the project ID,
   * retrieves the history from local storage, and returns it.
   * @param {number} projectId - The ID of the project whose history is to be retrieved.
   * @returns {ProjectVersion<T>[]} An array of project versions, which are of generic type T.
   */
  getProjectHistory(projectId: string): ProjectVersion<T>[] {
    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');
    return projectHistory;
  }

  /**
   * Retrieves a specific version of a project by its ID and version number.
   * This method is intended to be implemented, providing functionality to access
   * a particular version of a project's data.
   * @param {number} projectId - The ID of the project.
   * @param {number} versionNum - The version number of the project to retrieve.
   * @returns {T | undefined} The project data of the specified version if found, otherwise undefined.
   */
  getProjectVersion(projectId: string, versionNum: number): T | undefined {
    const projectHistory = this.getProjectHistory(projectId);
    const version = projectHistory.find((v) => v.versionNum === versionNum);
    return version ? version.project : undefined;
  }

  /**
   * Reverts a project to a specific version by its ID and version number.
   * This method updates the current project data to the specified version
   * and persists the updated list to local storage.
   * @param {number} projectId - The ID of the project.
   * @param {number} versionNum - The version number of the project to revert to.
   * @returns {boolean} True if the project is successfully reverted, false otherwise.
   */
  revertToVersion(projectId: string, versionNum: number): boolean {
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

  /**
   * Updates the information of an existing project.
   * It finds the project by ID, updates its data, and then persists the updated list to local storage.
   * If the project is successfully updated, it returns true. Otherwise, it returns false.
   * @param {number} id - The ID of the project to update.
   * @param {T} data - The updated project data.
   * @returns {boolean} True if the project is successfully updated, false otherwise.
   */
  update(id: string, data: T): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      const previousVersion = { ...this.items[index] };
      const projectHistoryKey = `${this.storageKey}-history-${id}`;
      const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');

      // Create a new version entry for the project's history
      const versionNum = projectHistory.length + 1;

      const projectVersion: ProjectVersion<T> = {
        versionNum: versionNum,
        project: previousVersion,
      };

      projectHistory.push(projectVersion);

      localStorage.setItem(projectHistoryKey, JSON.stringify(projectHistory));

      // Update the project data
      this.items[index] = data;
      this.items[index].modified = new Date().toISOString().split('T')[0];
      this.itemsSubject.next([...this.items]);
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      return true;
    } else {
      return false;
    }
  }

  /**
   * Searches for projects by their ID and returns a list of projects that match.
   * This method filters the internal list of projects by the specified ID and returns the result.
   * @param {number} id - The ID of the project to search for.
   * @returns {T[]} An array of projects that match the specified ID.
   */
  searchData(id: string): T[] {
    return this.items.filter((item) => item.id === id);
  }
}
