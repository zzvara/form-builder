import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project, ProjectType } from '../dashboard.model';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css'],
})
export class CardViewComponent {
  @Input() projects: Project[] = [];

  @Output() deleteProject = new EventEmitter<string>();
  @Output() createProject = new EventEmitter<ProjectType>();
  @Output() editProject = new EventEmitter<void>();

  onDeleteProject(name: string) {
    this.deleteProject.emit(name);
  }

  onCreateProject() {
    this.createProject.emit(ProjectType.TEST);
  }

  onEditProject() {
    this.editProject.emit();
  }
}
