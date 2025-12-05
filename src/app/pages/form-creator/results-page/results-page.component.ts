import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { basicSetup, EditorView } from 'codemirror';
import { Compartment, EditorState } from '@codemirror/state';
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import { basicDark } from '@fsegurai/codemirror-theme-basic-dark';
import { basicLight } from '@fsegurai/codemirror-theme-basic-light';
import { EventService } from '@app/shared/services/event.service';
import { ThemeEnum } from '@app/shared/enums/theme.enum';
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

  project?: Project;
  projectHistory: ProjectVersion<Project>[] = [];
  sectionInputStats: { [key: string]: number | string } = {};
  latestVersionNum?: number;
  sectionInputs: FormInputData[] = [];

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
      this.projectHistory = this.projectService.getProjectHistory(this.projectId);
      this.latestVersionNum = this.projectHistory.length > 0 ? this.projectHistory[this.projectHistory.length - 1].versionNum : undefined;
      this.project = this.projectService.getProjectVersion(this.projectId, this.latestVersionNum ?? 1);

      this.calculateSectionInputStats();
    }

    this.project?.editList!.forEach((section) => {
      if ('sectionInputs' in section.data) {
        section.data.sectionInputs.forEach((input) => {
          this.sectionInputs.push(input);
        });
      }
    });
  }

  nextPage() {
    this.page! += 1;
    this.onsetPage(this.page!);

    this.router.navigate(['/']);
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

  ngOnDestroy(): void {
    this.jsonService.destroy();
  }
}
