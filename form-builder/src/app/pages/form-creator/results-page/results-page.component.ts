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
  project: Project | undefined;

  constructor(private projectService: ProjectService<Project>, private jsonService: JsonService) {}

  ngOnInit(): void {
    if (this.projectId !== undefined) {
      this.project = this.projectService.getProjectVersion(this.projectId, this.versionNum || 1);
    }
  }

  nextPage() {
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  saveProjectWithHistoryToJson(): void {
    if (this.projectId !== undefined) {
      const projectHistory = this.projectService.getProjectHistory(this.projectId);
      if (this.project) {
        this.jsonService.saveProjectWithHistoryToJson(this.project, projectHistory);
      }
    }
  }

  saveProjectToJson(): void {
    if (this.projectId !== undefined) {
      if (this.project) {
        this.jsonService.saveProjectToJson(this.project);
      }
    }
  }
}
