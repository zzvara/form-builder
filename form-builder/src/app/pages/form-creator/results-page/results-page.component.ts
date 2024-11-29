import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project, ProjectVersion } from 'src/app/interfaces/project';
import { JsonService } from 'src/app/services/json.service';
import { ProjectService } from 'src/app/services/project.service';
import { StatisticsService } from './services/statistics.service';

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
  projectHistory: ProjectVersion<Project>[] = [];
  sectionInputStats: { [key: string]: number | string } = {};
  latestVersionNum: number | undefined;

  constructor(
    private projectService: ProjectService<Project>,
    private jsonService: JsonService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    if (this.projectId !== undefined) {
      this.project = this.projectService.getProjectVersion(this.projectId, this.versionNum || 1);
      this.projectHistory = this.projectService.getProjectHistory(this.projectId);
      this.latestVersionNum = this.projectHistory.length > 0 ? this.projectHistory[this.projectHistory.length - 1].versionNum : undefined;
      this.calculateSectionInputStats();
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
    if (this.project) {
      this.jsonService.saveProjectWithHistoryToJson(this.project, this.projectHistory);
    }
  }

  saveProjectToJson(): void {
    if (this.project) {
      this.jsonService.saveProjectToJson(this.project);
    }
  }

  private calculateSectionInputStats(): void {
    if (this.project) {
      this.sectionInputStats = this.statisticsService.calculateSectionInputStats(this.project);
    }
  }
}
