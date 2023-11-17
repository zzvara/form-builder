import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectType, Questionnaire } from '../../../items/questionnaire.interface';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css'],
})
export class CardViewComponent implements OnInit {
  @Input() projects: Observable<Questionnaire[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<number>();
  @Output() createProject = new EventEmitter<ProjectType>();
  @Output() editProject = new EventEmitter<void>();

  projectList: Questionnaire[] = [];

  ngOnInit(): void {
    this.projects.subscribe((projects) => (this.projectList = projects.filter((project) => project.type === this.type)));
  }

  onDeleteProject(id: number): void {
    this.deleteProject.emit(id);
  }

  onCreateProject(type: ProjectType): void {
    this.createProject.emit(type);
  }

  onEditProject(): void {
    this.editProject.emit();
  }
}
