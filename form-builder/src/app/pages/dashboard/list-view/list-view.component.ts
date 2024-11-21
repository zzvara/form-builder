import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ColumnItem } from '../dashboard.model';
import { ProjectType } from 'src/app/interfaces/project';
import { Questionnaire } from 'src/app/interfaces/questionnaire/questionnaire.interface';

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

  ngOnInit(): void {
    this.projects.subscribe((projects) => (this.projectList = projects.filter((project) => project.type === this.type)));
  }

  columnsConfig: ColumnItem[] = [
    {
      title: 'Title',
      sortOrder: null,
      sortFn: (a: Questionnaire, b: Questionnaire) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      title: 'Created',
      sortOrder: 'descend',
      sortFn: (a: Questionnaire, b: Questionnaire) => a.created.localeCompare(b.created),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      title: 'Modified',
      sortOrder: null,
      sortFn: (a: Questionnaire, b: Questionnaire) => a.modified.localeCompare(b.modified),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  onDeleteProject(id: number): void {
    this.deleteProject.emit(id);
  }

  onEditProject(id: number): void {
    this.editProject.emit(id);
  }
}
