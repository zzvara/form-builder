import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProjectType } from '@interfaces/project';
import { ColumnItem } from '@app/shared/interfaces/column-item.model';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';
import { DatePipe } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzTableComponent,
    NzTableModule,
    NzTooltipModule,
    NzPopconfirmModule,
    NzIconModule,
    SafeHtmlPipe,
    TranslatePipe,
    DatePipe,
  ],
})
export class ListViewComponent {
  readonly projects = input<Questionnaire[]>([]);
  readonly type = input<ProjectType>();

  @Output() deleteProject = new EventEmitter<string>();
  @Output() editProject = new EventEmitter<string>();

  readonly projectList = computed(() =>
    this.projects().filter((project) => project.type === this.type()),
  );
  readonly columnsConfig = signal<ColumnItem[]>([]);

  DateFormat = DateFormat;

  constructor(private translate: TranslateService) {
    this.setColumnsConfig();
    this.translate.onLangChange.pipe(takeUntilDestroyed()).subscribe(() => this.setColumnsConfig());
  }

  setColumnsConfig(): void {
    this.columnsConfig.set([
      {
        title: this.translate.instant('GENERAL.TITLE'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.title.localeCompare(b.title),
        sortDirections: ['ascend', 'descend', null],
        width: '20%',
        minWidth: '120px',
      },
      {
        title: this.translate.instant('GENERAL.DESCRIPTION'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.description.localeCompare(b.description),
        sortDirections: ['ascend', 'descend', null],
        width: 'auto',
        minWidth: '180px',
      },
      {
        title: this.translate.instant('GENERAL.CREATED'),
        sortOrder: 'descend',
        sortFn: (a: Questionnaire, b: Questionnaire) => a.created.localeCompare(b.created),
        sortDirections: ['ascend', 'descend', null],
        width: '15%',
        minWidth: '100px',
      },
      {
        title: this.translate.instant('GENERAL.MODIFIED'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.modified.localeCompare(b.modified),
        sortDirections: ['ascend', 'descend', null],
        width: '15%',
        minWidth: '100px',
      },
      {
        title: this.translate.instant('DASHBOARD.ACTION'),
        sortDirections: [],
        sortFn: null,
        sortOrder: null,
        width: '100px',
        minWidth: '100px',
      },
    ]);
  }

  onDeleteProject(id: string): void {
    this.deleteProject.emit(id);
  }

  onEditProject(id: string): void {
    this.editProject.emit(id);
  }
}
