import { Component } from '@angular/core';
import { Project, ProjectType } from './dashboard.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  projects: BehaviorSubject<Project[]> = new BehaviorSubject(
    JSON.parse(sessionStorage.getItem('projects') ?? '[]')
  );
  isListView = false;

  constructor(private readonly router: Router) {}

  createProject(type: string): void {
    this.projects.next([
      ...this.projects.value,
      {
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${Math.floor(
          Math.random() * 1000
        )}`,
        created: new Date().toDateString(),
        modified: new Date().toDateString(),
        type: type as ProjectType,
      },
    ]);
    sessionStorage.setItem('projects', JSON.stringify(this.projects.value));
  }

  deleteProject(name: string): void {
    this.projects.next(
      this.projects.value.filter((project) => project.name !== name)
    );
    sessionStorage.setItem('projects', JSON.stringify(this.projects.value));
  }

  editProject() {
    this.router.navigate(['edit']);
  }
}
