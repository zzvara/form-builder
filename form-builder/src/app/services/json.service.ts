import { Injectable } from '@angular/core';
import { Project, ProjectVersion } from '../items/project.interface';

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  constructor() {}

  /**
   * Saves the current project and its history to a JSON file and triggers a download.
   * This method retrieves the current project version and its history based on the project ID.
   * @param {Project} project - The project to save.
   * @param {ProjectVersion<Project>[]} projectHistory - The history of the project versions.
   * @returns {void}
   */
  saveProjectWithHistoryToJson(project: Project, projectHistory: ProjectVersion<Project>[]): void {
    const data = {
      project,
      history: projectHistory,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
