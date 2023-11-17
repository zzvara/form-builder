import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Questionnaire, ProjectType } from '../../items/questionnaire.interface';
import { QuestionnaireService } from '../../services/questionnaire.service';

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
    private readonly modal: NzModalService,
    private readonly questionnaireService: QuestionnaireService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.questionnaireService.list();
  }

  createProject(type: ProjectType): void {
    this.router.navigate(['new'], { queryParams: { type } });
  }

  deleteProject(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this project?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.questionnaireService.remove(id);
      },
      nzCancelText: 'No',
    });
  }

  editProject() {
    this.router.navigate(['new']);
  }
}
