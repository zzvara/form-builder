import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/items/project.interface';
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

  constructor(private projectService: ProjectService<Project>) {}

  formInputs: any[] = [];

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

  ngOnInit(): void {
    this.loadProjectFormInputs();
    console.log({ formInputs: this.formInputs });
  }

  nextPage() {
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
