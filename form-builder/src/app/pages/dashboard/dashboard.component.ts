import { Component } from '@angular/core';
import { Project, ProjectType } from './dashboard.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  projects$: BehaviorSubject<Project[]> = new BehaviorSubject(
    JSON.parse(localStorage.getItem('projects') ?? '[]')
  );
  isListView = true;
  projectTypes = ProjectType;

  constructor(
    private readonly router: Router,
    private readonly modal: NzModalService
  ) {}

  createProject(type: ProjectType): void {
    this.router.navigate(['new'], { queryParams: { type } });

    // TODO relocate this logic after form is ready.
    this.projects$.next([
      ...this.projects$.value,
      {
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${Math.floor(
          Math.random() * 1000
        )}`,
        created: new Date().toDateString(),
        modified: new Date().toDateString(),
        type,
      },
    ]);
    localStorage.setItem('projects', JSON.stringify(this.projects$.value));
  }

  deleteProject(name: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this project?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.projects$.next(
          this.projects$.value.filter((project) => project.name !== name)
        );
        localStorage.setItem('projects', JSON.stringify(this.projects$.value));
      },
      nzCancelText: 'No',
    });
  }

  editProject() {
    this.router.navigate(['new']);
  }
}
