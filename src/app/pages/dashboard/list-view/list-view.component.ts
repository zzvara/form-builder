import { Component, OnInit, ChangeDetectionStrategy, input, output, computed, inject, signal, DestroyRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectType } from '@interfaces/project';
import { ColumnItem } from '@app/shared/interfaces/column-item.model';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { DateFormat } from '@app/shared/constants/date-format.constant';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.less'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListViewComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  projects = input<Questionnaire[]>([]);
  type = input<ProjectType>();

  deleteProject = output<string>();
  editProject = output<string>();

  projectList = computed(() => this.projects().filter((project) => project.type === this.type()));
  columnsConfig = signal<ColumnItem[]>([]);

  DateFormat = DateFormat;

  ngOnInit(): void {
    this.setColumnsConfig();
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.setColumnsConfig();
    });
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
