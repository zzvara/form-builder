import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/items/project.interface';
import { JsonService } from 'src/app/services/json.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css'],
})
export class ResultsPageComponent implements OnInit {
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Input() projectId: number | undefined;
  @Input() versionNum?: number | undefined;
  formInputs: any[] = [];

  constructor(private projectService: ProjectService<Project>, private jsonService: JsonService) {}

  ngOnInit(): void {
    this.loadProjectFormInputs();
  }

  nextPage() {
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  /**
   * Loads project form inputs based on the current project ID and version number.
   * If a project and its form inputs are found, it updates the formInputs array with the project's form inputs.
   * @returns {void}
   */
  private loadProjectFormInputs(): void {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum || 1);
      if (project && project.formInputs) {
        this.formInputs = [...project.formInputs];
      }
    }
  }

  /**
   * Saves the current form state by calling saveForm on the editComponent.
   * Then, it increments the page number and emits an event to notify parent components of the page change.
   * @returns {void}
   */
  saveJson(): void {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum || 1);
      const projectHistory = this.projectService.getProjectHistory(this.projectId);
      if (project) {
        this.jsonService.saveProjectWithHistoryToJson(project, projectHistory);
      }
    }
  }
}
