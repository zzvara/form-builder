import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { ProjectType } from '@interfaces/project';
import { ProjectService } from '@services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  projects$: Observable<Questionnaire[]> = of([]);
  isListView = true;
  projectTypes = ProjectType;

  constructor(
    private readonly router: Router,
    private readonly questionnaireService: ProjectService<Questionnaire>
  ) {}

  ngOnInit(): void {
    this.projects$ = this.questionnaireService.list();
    const savedView = localStorage.getItem('viewPreference');
    if (savedView) {
      this.isListView = savedView === 'list';
    }
  }

  createProject(type: ProjectType): void {
    if (type === ProjectType.TEST) {
      this.router.navigate(['new'], { queryParams: { type: 'TEST' } });
    } else {
      this.router.navigate(['new'], { queryParams: { type: 'QUESTIONNAIRE' } });
    }
  }

  deleteProject(id: string): void {
    this.questionnaireService.remove(id);
  }

  editProject(id: string) {
    this.router.navigate(['edit'], { queryParams: { id } });
  }

  toggleView(): void {
    this.isListView = !this.isListView;
    localStorage.setItem('viewPreference', this.isListView ? 'list' : 'card');
  }
}
