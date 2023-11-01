import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnItem, Project, ProjectType } from '../dashboard.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
})
export class ListViewComponent implements OnInit {
  @Input() projects: Observable<Project[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<string>();
  @Output() editProject = new EventEmitter<void>();

  projectList: Project[] = [];

  ngOnInit(): void {
    this.projects.subscribe(
      (projects) =>
        (this.projectList = projects.filter(
          (project) => project.type === this.type
        ))
    );
  }

  columnsConfig: ColumnItem[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: Project, b: Project) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Created',
      sortOrder: 'descend',
      sortFn: (a: Project, b: Project) => a.created.localeCompare(b.created),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Modified',
      sortOrder: null,
      sortFn: (a: Project, b: Project) => a.modified.localeCompare(b.modified),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  onDeleteProject(name: string): void {
    this.deleteProject.emit(name);
  }

  onEditProject(): void {
    this.editProject.emit();
  }
}
