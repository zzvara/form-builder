import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { JsonService } from '@services/json.service';
import { ProjectService } from '@services/project.service';
import { ColumnItem } from '@pages/dashboard/dashboard.model';
import { StatisticsService } from '@pages/form-creator/results-page/services/statistics.service';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.less'],
  standalone: false,
})
export class ResultsPageComponent implements OnInit {
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Input() projectId: string | undefined;
  @Input() versionNum?: number;
  project?: Project;
  projectHistory: ProjectVersion<Project>[] = [];
  sectionInputStats: { [key: string]: number | string } = {};
  latestVersionNum?: number;
  sectionInputs: any[] = [];

  constructor(
    private readonly projectService: ProjectService<Project>,
    private readonly jsonService: JsonService,
    private readonly statisticsService: StatisticsService
  ) {}

  columnsConfig: ColumnItem[] = [
    {
      title: 'Question',
      sortOrder: null,
      sortFn: (a: Questionnaire, b: Questionnaire) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      title: 'Description',
      sortOrder: null,
      sortFn: (a: Questionnaire, b: Questionnaire) => a.description.localeCompare(b.description),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  ngOnInit(): void {
    if (this.projectId !== undefined) {
      this.projectHistory = this.projectService.getProjectHistory(this.projectId);
      this.latestVersionNum = this.projectHistory.length > 0 ? this.projectHistory[this.projectHistory.length - 1].versionNum : undefined;
      this.project = this.projectService.getProjectVersion(this.projectId, this.latestVersionNum ?? 1);

      this.calculateSectionInputStats();
    }

    this.project?.editList!.forEach((section) => {
      if ('sectionInputs' in section.data) {
        section.data.sectionInputs!.forEach((input) => {
          this.sectionInputs.push(input);
        });
      }
    });

    console.log(this.sectionInputs);
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

  // @todo ngOnDestroy function without the OnDestroy lifecycle hook.
  ngOnDestroy(): void {
    this.jsonService.destroy();
  }
}
