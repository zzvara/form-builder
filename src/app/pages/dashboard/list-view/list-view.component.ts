import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import type { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { ProjectType } from '@interfaces/project';
import type { ColumnItem } from '@app/shared/interfaces/column-item.model';
import type { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
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
export class ListViewComponent implements OnInit {
  private translate = inject(TranslateService);

  @Input() projects: Observable<Questionnaire[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<string>();
  @Output() editProject = new EventEmitter<string>();

  projectList: Questionnaire[] = [];
  columnsConfig: ColumnItem[] = [];

  DateFormat = DateFormat;

  ngOnInit(): void {
    this.projects.subscribe((projects) => {
      this.projectList = projects.filter((project) => project.type === this.type);
    });

    this.setColumnsConfig();
    this.translate.onLangChange.subscribe(() => this.setColumnsConfig());
  }

  setColumnsConfig(): void {
    this.columnsConfig = [
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
    ];
  }

  onDeleteProject(id: string): void {
    this.deleteProject.emit(id);
  }

  onEditProject(id: string): void {
    this.editProject.emit(id);
  }
}
