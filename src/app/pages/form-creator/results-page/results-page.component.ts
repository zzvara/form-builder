import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { JsonService } from '@services/json.service';
import { ProjectService } from '@services/project.service';
import { ColumnItem } from '@app/shared/interfaces/column-item.model';
import { StatisticsService } from '@pages/form-creator/results-page/services/statistics.service';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormInputData } from '@app/shared/interfaces/form-input-data';
import { CodeEditorMode, CodeEditorType } from '@app/shared/enums/code-editor.enum';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzTabComponent, NzTabsComponent } from 'ng-zorro-antd/tabs';
import { NzDescriptionsComponent, NzDescriptionsItemComponent } from 'ng-zorro-antd/descriptions';
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { DatePipe, JsonPipe, KeyValuePipe, UpperCasePipe } from '@angular/common';
import { CodeEditorComponent } from '@app/shared/components/code-editor/code-editor.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzLayoutComponent,
    NzTabsComponent,
    NzTabComponent,
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    SafeHtmlPipe,
    NzTooltipModule,
    UpperCasePipe,
    TranslatePipe,
    DatePipe,
    KeyValuePipe,
    CodeEditorComponent,
    NzPopconfirmModule,
    JsonPipe,
    NzButtonComponent,
    NzIconModule,
    NzPopoverModule,
  ],
})
export class ResultsPageComponent implements OnInit, OnDestroy {
  readonly page = input<number>();
  readonly projectId = input<string>();
  readonly versionNum = input<number>();

  readonly setPage = output<number>();

  readonly project = signal<Project | undefined>(undefined);
  readonly projectHistory = signal<ProjectVersion<Project>[]>([]);
  readonly sectionInputStats = signal<{ [key: string]: number | string }>({});
  readonly latestVersionNum = signal<number | undefined>(undefined);
  readonly sectionInputs = signal<FormInputData[]>([]);

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
  ) {}

  ngOnInit(): void {
    const projectId = this.projectId();
    if (projectId !== undefined) {
      const projectHistory = this.projectService.getProjectHistory(projectId);
      const latestVersionNum =
        projectHistory.length > 0 ? projectHistory[projectHistory.length - 1].versionNum : undefined;
      this.projectHistory.set(projectHistory);
      this.latestVersionNum.set(latestVersionNum);
      this.project.set(this.projectService.getProjectVersion(projectId, latestVersionNum ?? 1));

      this.calculateSectionInputStats();
    }

    const sectionInputs: FormInputData[] = [];
    this.project()?.editList!.forEach((section) => {
      if ('sectionInputs' in section.data) {
        sectionInputs.push(...section.data.sectionInputs);
      }
    });
    this.sectionInputs.set(sectionInputs);
  }

  nextPage() {
    this.onsetPage(this.page()! + 1);

    this.router.navigate(['/']);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  saveProjectWithHistoryToJson(): void {
    const project = this.project();
    if (project) {
      this.jsonService.saveProjectWithHistoryToJson(project, this.projectHistory());
    }
  }

  saveProjectToJson(): void {
    const project = this.project();
    if (project) {
      this.jsonService.saveProjectToJson(project);
    }
  }

  private calculateSectionInputStats(): void {
    const project = this.project();
    if (project) {
      this.sectionInputStats.set(this.statisticsService.calculateSectionInputStats(project));
    }
  }

  ngOnDestroy(): void {
    this.jsonService.destroy();
  }
}
