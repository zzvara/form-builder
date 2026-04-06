import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
/**
 * This service provides functionality to manage a collection of projects.
 * Projects are generic, allowing for flexibility in the types of projects managed.
 */
export class ProjectService<T extends Project> {
  private readonly itemsSignal: WritableSignal<T[]> = signal<T[]>([]);
  private readonly storageKey: string = 'project';

  constructor() {
    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as T[];
        this.itemsSignal.set(parsedData);
      } catch (e) {
        console.error('Failed to parse projects from local storage', e);
        this.itemsSignal.set([]);
      }
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
   * This method returns a signal that emits the current list of projects.
   * @returns {Signal<T[]>} A readonly signal of the current list of projects.
   */
  list(): Signal<T[]> {
    return this.itemsSignal.asReadonly();
  }

  /**
   * Adds a new project to the list and persists the updated list to local storage.
   * @param {T} data - The project data to add.
   * @returns {void}
   */
  add(data: T): void {
    data.id = this.generateNextId();
    const now = new Date().toISOString();
    data.created = now.split('T')[0];
    data.modified = now.split('T')[0];

    this.itemsSignal.update((items) => {
      const newItems = [...items, data];
      localStorage.setItem(this.storageKey, JSON.stringify(newItems));
      return newItems;
    });

    const projectHistoryKey = `${this.storageKey}-history-${data.id}`;
    const initialVersion: ProjectVersion<T> = {
      versionNum: 1,
      project: { ...data },
      created: now,
    };
    localStorage.setItem(projectHistoryKey, JSON.stringify([initialVersion]));
  }

  /**
   * Removes a project by its ID from the list and updates local storage.
   * @param {string} projectId
   * @returns {void}
   */
  remove(projectId: string): void {
    this.itemsSignal.update((items) => {
      const newItems = items.filter((item) => item.id !== projectId);
      localStorage.setItem(this.storageKey, JSON.stringify(newItems));
      return newItems;
    });

    const projectHistoryKey = `${this.storageKey}-history-${projectId}`;
    localStorage.removeItem(projectHistoryKey);
  }

  /**
   * Retrieves the history of versions for a specific project from local storage.
   * @param {string} projectId - The ID of the project whose history is to be retrieved.
   * @returns {ProjectVersion<T>[]} An array of project versions.
   */
  getProjectHistory(projectId: string): ProjectVersion<T>[] {
    const key = `${this.storageKey}-history-${projectId}`;
    let history = JSON.parse(localStorage.getItem(key) ?? '[]') as ProjectVersion<T>[];

    if (history.length === 0) {
      const proj = this.itemsSignal().find((i) => i.id === projectId);
      if (proj) {
        const now = proj.created ? new Date(proj.created).toISOString() : new Date().toISOString();
        history = [
          {
            versionNum: 1,
            project: { ...proj },
            created: now,
          },
        ];
        localStorage.setItem(key, JSON.stringify(history));
      }
    }

    return history;
  }

  /**
   * Retrieves a specific version of a project by its ID and version number.
   * @param {string} projectId - The ID of the project.
   * @param {number} versionNum - The version number of the project to retrieve.
   * @returns {T | undefined} The project data of the specified version if found.
   */
  getProjectVersion(projectId: string, versionNum: number): T | undefined {
    const projectHistory = this.getProjectHistory(projectId);
    const version = projectHistory.find((v) => v.versionNum === versionNum);
    return version ? version.project : undefined;
  }

  /**
   * Reverts a project to a specific version by its ID and version number.
   * @param {string} projectId - The ID of the project.
   * @param {number} versionNum - The version number of the project to revert to.
   * @returns {boolean} True if the project is successfully reverted.
   */
  revertToVersion(projectId: string, versionNum: number): boolean {
    const projectHistory = this.getProjectHistory(projectId);
    const version = projectHistory.find((v) => v.versionNum === versionNum);

    if (version) {
      let isReverted = false;

      this.itemsSignal.update((items) => {
        const newItems = [...items];
        const index = newItems.findIndex((item) => item.id === projectId);

        if (index !== -1) {
          newItems[index] = version.project;
          newItems[index].modified = new Date().toISOString().split('T')[0];
          localStorage.setItem(this.storageKey, JSON.stringify(newItems));
          isReverted = true;
        }

        return newItems;
      });

      return isReverted;
    }
    return false;
  }

  /**
   * Updates the information of an existing project.
   * @param {string} id - The ID of the project to update.
   * @param {T} data - The updated project data.
   * @returns {boolean} True if the project is successfully updated.
   */
  update(id: string, data: T): boolean {
    let isUpdated = false;

    this.itemsSignal.update((items) => {
      const newItems = [...items];
      const index = newItems.findIndex((item) => item.id === id);

      if (index !== -1) {
        const previousVersion = { ...newItems[index] };
        const projectHistoryKey = `${this.storageKey}-history-${id}`;
        const projectHistory: ProjectVersion<T>[] = JSON.parse(localStorage.getItem(projectHistoryKey) || '[]');

        const latestVersion = projectHistory[projectHistory.length - 1]?.project;
        if (latestVersion && JSON.stringify(latestVersion) === JSON.stringify(data)) {
          return items; // No change detected
        }

        const versionNum = projectHistory.length + 1;
        const projectVersion: ProjectVersion<T> = {
          versionNum: versionNum,
          project: previousVersion,
          created: new Date().toISOString(),
        };

        projectHistory.push(projectVersion);
        localStorage.setItem(projectHistoryKey, JSON.stringify(projectHistory));

        newItems[index] = data;
        newItems[index].modified = new Date().toISOString().split('T')[0];
        localStorage.setItem(this.storageKey, JSON.stringify(newItems));
        isUpdated = true;
      }

      return isUpdated ? newItems : items;
    });

    return isUpdated;
  }

  /**
   * Searches for projects by their ID and returns a list of projects that match.
   * @param {string} id - The ID of the project to search for.
   * @returns {T[]} An array of projects that match the specified ID.
   */
  searchData(id: string): T[] {
    return this.itemsSignal().filter((item) => item.id === id);
  }
}
