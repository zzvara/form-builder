import { Injectable } from '@angular/core';
import { Project, ProjectVersion } from '../items/project.interface';

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  constructor() {}

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
    this.triggerDownload(url, 'project.json');
  }

  /**
   * Saves the current project to a JSON file and triggers a download.
   * @param {Project} project - The project to save.
   * @returns {void}
   */
  saveProjectToJson(project: Project): void {
    const blob = this.createJsonBlob(project);
    const url = this.createDownloadLink(blob);
    this.triggerDownload(url, 'project.json');
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
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
