import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, signal, Signal, WritableSignal } from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { JsonService } from '@services/json.service';
import { ProjectService } from '@services/project.service';
import { ColumnItem } from '@app/shared/interfaces/column-item.model';
import { StatisticsService } from '@pages/form-creator/results-page/services/statistics.service';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormInputData } from '@app/shared/interfaces/form-input-data';
import { CodeEditorMode, CodeEditorType } from '@app/shared/enums/code-editor.enum';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.less'],
  standalone: false,
})
export class ResultsPageComponent implements OnInit, OnDestroy {
  @Input() page?: number;
  @Input() projectId: string | undefined;
  @Input() versionNum?: number;

  @Output() setPage = new EventEmitter<number>();

  private readonly _project = signal<Project | undefined>(undefined);
  public readonly project = this._project.asReadonly();

  private readonly _projectHistory = signal<ProjectVersion<Project>[]>([]);
  public readonly projectHistory = this._projectHistory.asReadonly();

  private readonly _sectionInputStats = signal<{ [key: string]: number | string }>({});
  public readonly sectionInputStats = this._sectionInputStats.asReadonly();

  private readonly _latestVersionNum = signal<number | undefined>(undefined);
  public readonly latestVersionNum = this._latestVersionNum.asReadonly();

  private readonly _sectionInputs = signal<FormInputData[]>([]);
  public readonly sectionInputs = this._sectionInputs.asReadonly();

  columnsConfig: ColumnItem[] = [
    {
      title: this.translate.instant('RESULTS.QUESTION'),
      sortOrder: null,
      sortFn: (a: Questionnaire, b: Questionnaire) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      title: this.translate.instant('RESULTS.DESCRIPTION'),
      sortOrder: null,
      sortFn: (a: Questionnaire, b: Questionnaire) => a.description.localeCompare(b.description),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  DateFormat = DateFormat;
  CodeEditorMode = CodeEditorMode;
  CodeEditorType = CodeEditorType;

  constructor(
    private readonly projectService: ProjectService<Project>,
    private readonly jsonService: JsonService,
    private readonly statisticsService: StatisticsService,
    private readonly translate: TranslateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.projectId !== undefined) {
      const history = this.projectService.getProjectHistory(this.projectId);
      this._projectHistory.set(history);

      const latestNum = history.length > 0 ? history[history.length - 1].versionNum : undefined;
      this._latestVersionNum.set(latestNum);

      const proj = this.projectService.getProjectVersion(this.projectId, latestNum ?? 1);
      this._project.set(proj);

      this.calculateSectionInputStats();
    }

    const currentProject = this._project();
    if (currentProject?.editList) {
      const inputs: FormInputData[] = [];
      currentProject.editList.forEach((section) => {
        if ('sectionInputs' in section.data) {
          section.data.sectionInputs.forEach((input) => {
            inputs.push(input);
          });
        }
      });
      this._sectionInputs.set(inputs);
    }
  }

  nextPage() {
    if (this.page !== undefined) {
      this.page += 1;
      this.onsetPage(this.page);
    }
    this.router.navigate(['/']);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  saveProjectWithHistoryToJson(): void {
    const proj = this._project();
    if (proj) {
      this.jsonService.saveProjectWithHistoryToJson(proj, this._projectHistory());
    }
  }

  saveProjectToJson(): void {
    const proj = this._project();
    if (proj) {
      this.jsonService.saveProjectToJson(proj);
    }
  }

  private calculateSectionInputStats(): void {
    const proj = this._project();
    if (proj) {
      this._sectionInputStats.set(this.statisticsService.calculateSectionInputStats(proj));
    }
  }

  ngOnDestroy(): void {
    this.jsonService.clearJsonData();
  }
}
