import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProjectType } from '@interfaces/project';
import { ColumnItem } from '@pages/dashboard/dashboard.model';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.less'],
  standalone: false,
})
export class ListViewComponent implements OnInit {
  @Input() projects: Observable<Questionnaire[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<string>();
  @Output() editProject = new EventEmitter<string>();

  projectList: Questionnaire[] = [];
  columnsConfig: ColumnItem[] = [];

  constructor(private translate: TranslateService) {}

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
      },
      {
        title: this.translate.instant('GENERAL.DESCRIPTION'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.description.localeCompare(b.description),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('GENERAL.CREATED'),
        sortOrder: 'descend',
        sortFn: (a: Questionnaire, b: Questionnaire) => a.created.localeCompare(b.created),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('GENERAL.MODIFIED'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.modified.localeCompare(b.modified),
        sortDirections: ['ascend', 'descend', null],
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
