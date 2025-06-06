import { Injectable } from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { Observable, BehaviorSubject } from 'rxjs';

interface ProjectData {
  project: Project;
  history?: ProjectVersion<Project>[];
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  private jsonDataSubject = new BehaviorSubject<ProjectData | null>(null);
  jsonData$ = this.jsonDataSubject.asObservable();

  /**
   * Validates if a project has the required properties.
   * @param {Project} project - The project to validate.
   * @returns {boolean} - True if project is valid, false otherwise.
   */
  private validateProject(project: Project): boolean {
    return project && project.id !== undefined;
  }

  /**
   * Saves the current project and its history to a JSON file and triggers a download.
   * @param {Project} project - The project to save.
   * @param {ProjectVersion<Project>[]} projectHistory - The history of the project versions.
   * @returns {void}
   */
  saveProjectWithHistoryToJson(project: Project, projectHistory: ProjectVersion<Project>[]): void {
    if (!this.validateProject(project)) {
      throw new Error('Invalid project data');
    }

    const data: ProjectData = {
      project,
      history: projectHistory,
    };
    const blob = this.createJsonBlob(data);
    const url = this.createDownloadLink(blob);
    this.triggerDownload(url, `project_${project.id}_history.json`);
  }

  /**
   * Saves the current project to a JSON file and triggers a download.
   * @param {Project} project - The project to save.
   * @returns {void}
   */
  saveProjectToJson(project: Project): void {
    if (!this.validateProject(project)) {
      throw new Error('Invalid project data');
    }

    const data: ProjectData = {
      project,
    };

    const blob = this.createJsonBlob(data);
    const url = this.createDownloadLink(blob);
    this.triggerDownload(url, `project_${project.id}.json`);
  }

  /**
   * Creates a JSON Blob from the given data.
   * @param {object} data - The data to convert to JSON.
   * @returns {Blob} - The created JSON Blob.
   */
  private createJsonBlob(data: object): Blob {
    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  /**
   * Creates a download link for the given Blob.
   * @param {Blob} blob - The Blob to create a download link for.
   * @returns {string} - The created download link URL.
   */
  private createDownloadLink(blob: Blob): string {
    return window.URL.createObjectURL(blob);
  }

  /**
   * Triggers the download of the file from the given URL and revokes the URL.
   * @param {string} url - The URL to download the file from.
   * @param {string} filename - The name of the file to download.
   * @returns {void}
   */
  private triggerDownload(url: string, filename: string): void {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } finally {
      window.URL.revokeObjectURL(url);
    }
  }

  /**
   * Uploads a JSON file and parses its content.
   * @param {File} file - The JSON file to upload.
   * @returns {Observable<ProjectData>} - An observable with the parsed JSON content.
   */
  uploadJson(file: File): Observable<ProjectData> {
    return new Observable((observer) => {
      if (!file.type.includes('application/json')) {
        observer.error(new Error('Invalid file type. Please upload a JSON file.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const target = event.target;
          if (!target || typeof target.result !== 'string') {
            throw new Error('No file content found');
          }

          const json = JSON.parse(target.result) as ProjectData;

          if (!this.validateProject(json.project)) {
            throw new Error('Invalid project data');
          }

          // Clear the ID to ensure a new one is generated when the project is saved
          json.project.id = '';

          // Update modification date
          // json.project.created = new Date().toISOString().split('T')[0];
          json.project.modified = new Date().toISOString().split('T')[0];

          observer.next(json);
          observer.complete();
        } catch (e) {
          observer.error(new Error('Failed to parse JSON file. Please ensure the file is valid.'));
        }
      };
      reader.onerror = () => observer.error(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Updates the JSON data in the BehaviorSubject.
   * @param {ProjectData} data - The new JSON data to set.
   * @returns {void}
   */
  setJsonData(data: ProjectData): void {
    this.jsonDataSubject.next(data);
  }

  /**
   * Retrieves the current JSON data as an Observable.
   * @returns {Observable<ProjectData | null>} - Observable of the current JSON data.
   */
  getJsonData(): Observable<ProjectData | null> {
    return this.jsonData$;
  }

  /**
   * Clears the current JSON data by setting it to null.
   * @returns {void}
   */
  clearJsonData(): void {
    this.jsonDataSubject.next(null);
  }

  /**
   * Performs cleanup by completing the BehaviorSubject.
   * Should be called when the service is no longer needed.
   * @returns {void}
   */
  destroy(): void {
    this.jsonDataSubject.complete();
  }
}
