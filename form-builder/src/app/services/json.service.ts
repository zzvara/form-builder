import { Injectable } from '@angular/core';
import { Project, ProjectVersion } from '../interfaces/project';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  private jsonDataSubject = new BehaviorSubject<any>(null);
  jsonData$ = this.jsonDataSubject.asObservable();

  /**
   * Saves the current project and its history to a JSON file and triggers a download.
   * @param {Project} project - The project to save.
   * @param {ProjectVersion<Project>[]} projectHistory - The history of the project versions.
   * @returns {void}
   */
  saveProjectWithHistoryToJson(project: Project, projectHistory: ProjectVersion<Project>[]): void {
    const data = {
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
    const data = {
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
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Uploads a JSON file and parses its content.
   * @param {File} file - The JSON file to upload.
   * @returns {Observable<any>} - An observable with the parsed JSON content.
   */
  uploadJson(file: File): Observable<any> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const json = JSON.parse(event.target.result);
          observer.next(json);
          observer.complete();
        } catch (e) {
          observer.error(e);
        }
      };
      reader.onerror = (error) => observer.error(error);
      reader.readAsText(file);
    });
  }

  setJsonData(data: any): void {
    this.jsonDataSubject.next(data);
  }

  getJsonData(): Observable<any> {
    return this.jsonData$;
  }

  clearJsonData(): void {
    this.jsonDataSubject.next(null);
  }
}
