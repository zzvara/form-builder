import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ColumnItem } from '../dashboard.model';
import { ProjectType } from 'src/app/interfaces/project';
import { Questionnaire } from 'src/app/interfaces/questionnaire/questionnaire.interface';
import { TranslateService } from '@ngx-translate/core';

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
    this.translate.onLangChange.subscribe(() => this.setColumnsConfig()); // Újrakonfigurálás nyelvváltáskor
  }

  setColumnsConfig(): void {
    this.columnsConfig = [
      {
        title: this.translate.instant('TITLE'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.title.localeCompare(b.title),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('DESCRIPTION'),
        sortOrder: null,
        sortFn: (a: Questionnaire, b: Questionnaire) => a.description.localeCompare(b.description),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('CREATED'),
        sortOrder: 'descend',
        sortFn: (a: Questionnaire, b: Questionnaire) => a.created.localeCompare(b.created),
        sortDirections: ['ascend', 'descend', null],
      },
      {
        title: this.translate.instant('MODIFIED'),
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
