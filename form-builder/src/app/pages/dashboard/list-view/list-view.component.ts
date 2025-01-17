import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Questionnaire } from '@app/interfaces/questionnaire/questionnaire.interface';
import { ProjectType } from '@app/interfaces/project';
import { ColumnItem } from '@pages/dashboard/dashboard.model';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
})
export class ListViewComponent implements OnInit {
  @Input() projects: Observable<Questionnaire[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<number>();
  @Output() editProject = new EventEmitter<number>();

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
        title: this.translate.instant('general.TITLE'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.title.localeCompare(b.title),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('general.DESCRIPTION'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.description.localeCompare(b.description),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('general.CREATED'),
        sortOrder: 'descend',
        sortFn: (a: Questionnaire, b: Questionnaire) => a.created.localeCompare(b.created),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('general.MODIFIED'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.modified.localeCompare(b.modified),
        sortDirections: ['ascend', 'descend', null],
      },
    ];
  }

  onDeleteProject(id: number): void {
    this.deleteProject.emit(id);
  }

  onEditProject(id: number): void {
    this.editProject.emit(id);
  }
}
