import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project, ProjectType } from '../dashboard.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css'],
})
export class CardViewComponent implements OnInit {
  @Input() projects: Observable<Project[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<string>();
  @Output() createProject = new EventEmitter<ProjectType>();
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

  onDeleteProject(name: string): void {
    this.deleteProject.emit(name);
  }

  onCreateProject(type: ProjectType): void {
    this.createProject.emit(type);
  }

  onEditProject(): void {
    this.editProject.emit();
  }
}
