import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnItem, Project } from '../dashboard.model';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
})
export class ListViewComponent {
  @Input() projects: Project[] = [];

  @Output() deleteProject = new EventEmitter<string>();
  @Output() editProject = new EventEmitter<void>();

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

  onDeleteProject(name: string) {
    this.deleteProject.emit(name);
  }

  onEditProject() {
    this.editProject.emit();
  }
}
