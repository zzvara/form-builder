import { Component, OnDestroy, computed } from '@angular/core';
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
import { FormBuilderStore } from '@app/core/form-builder.store';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.less'],
  standalone: false,
})
export class ResultsPageComponent implements OnDestroy {
  public readonly project = this.store.project;

  public readonly projectHistory = computed(() => {
    this.projectService.items();
    const projectId = this.store.projectId();
    return projectId ? this.projectService.getProjectHistory(projectId) : [];
  });

  public readonly sectionInputStats = computed(() => {
    const proj = this.project();
    return proj ? this.statisticsService.calculateSectionInputStats(proj) : {};
  });

  public readonly latestVersionNum = computed(() => {
    const history = this.projectHistory();
    return history.length > 0 ? history[history.length - 1].versionNum : undefined;
  });

  public readonly sectionInputs = computed(() => {
    const proj = this.project();
    const inputs: FormInputData[] = [];
    if (proj?.editList) {
      proj.editList.forEach((section) => {
        if ('sectionInputs' in section.data) {
          section.data.sectionInputs.forEach((input) => inputs.push(input));
        }
      });
    }
    return inputs;
  });

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
    private readonly router: Router,
    public readonly store: FormBuilderStore
  ) {}

  nextPage() {
    this.router.navigate(['/']);
  }

  saveProjectWithHistoryToJson(): void {
    const proj = this.project();
    if (proj) {
      this.jsonService.saveProjectWithHistoryToJson(proj, this.projectHistory());
    }
  }

  saveProjectToJson(): void {
    const proj = this.project();
    if (proj) {
      this.jsonService.saveProjectToJson(proj);
    }
  }

  ngOnDestroy(): void {
    this.jsonService.clearJsonData();
  }
}
