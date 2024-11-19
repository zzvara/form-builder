import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectService } from '../../services/project.service';
import { ProjectType } from 'src/app/interfaces/project';
import { Questionnaire } from 'src/app/interfaces/questionnaire/questionnaire.interface';
import { JsonService } from '../../services/json.service';

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
    private readonly questionnaireService: ProjectService<Questionnaire>,
    private readonly jsonService: JsonService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.questionnaireService.list();
  }

  createProject(type: ProjectType): void {
    this.jsonService.clearJsonData();
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

  editProject(id: number) {
    this.router.navigate(['edit'], { queryParams: { id } });
  }

  uploadJson(file: File): void {
    this.jsonService.uploadJson(file).subscribe(data => {
      this.jsonService.setJsonData(data);
      this.router.navigate(['new'], {
        queryParams: { type: data.type },
        state: { projectData: data }
      });
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadJson(file);
    }
  }
}
