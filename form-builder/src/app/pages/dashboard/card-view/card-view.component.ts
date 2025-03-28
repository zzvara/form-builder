import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ProjectType } from '@interfaces/project';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.less'],
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CardViewComponent implements OnInit {
  @Input() projects: Observable<Questionnaire[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<string>();
  @Output() createProject = new EventEmitter<ProjectType>();
  @Output() editProject = new EventEmitter<string>();

  projectList: Questionnaire[] = [];

  ngOnInit(): void {
    this.projects.subscribe((projects) => (this.projectList = projects.filter((project) => project.type === this.type)));
  }

  onDeleteProject(id: string): void {
    this.deleteProject.emit(id);
  }

  onCreateProject(type: ProjectType): void {
    this.createProject.emit(type);
  }

  onEditProject(id: string): void {
    this.editProject.emit(id);
  }
}
