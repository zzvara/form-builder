import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { ProjectType } from 'src/app/interfaces/project';
import { Questionnaire } from 'src/app/interfaces/questionnaire/questionnaire.interface';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  projects$: Observable<Questionnaire[]> = of([]);
  isListView = true;
  projectTypes = ProjectType;

  constructor(
    private readonly router: Router,
    private readonly questionnaireService: ProjectService<Questionnaire>,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.questionnaireService.list();
    const savedView = localStorage.getItem('viewPreference');
    if (savedView) {
      this.isListView = savedView === 'list';
    }
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.translateService.use(savedLanguage);
  }

  createProject(type: ProjectType): void {
    if (type === ProjectType.TEST) {
      this.router.navigate(['new'], { queryParams: { type: 'TEST' } });
    } else {
      this.router.navigate(['new'], { queryParams: { type: 'QUESTIONNAIRE' } });
    }
  }

  deleteProject(id: number): void {
    this.questionnaireService.remove(id);
  }

  editProject(id: number) {
    this.router.navigate(['edit'], { queryParams: { id } });
  }

  toggleView(): void {
    this.isListView = !this.isListView;
    localStorage.setItem('viewPreference', this.isListView ? 'list' : 'card');
  }
}
