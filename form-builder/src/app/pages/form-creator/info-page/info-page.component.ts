import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project, ProjectType } from '../../../items/project.interface';
import { Question } from '../../../items/question/questions.interface';
import { ProjectService } from '../../../services/project.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();

  project = {
  id: 0,
  title: '',
  description: '',
  type: ProjectType.QUESTIONNAIRE,
  time_chechkbox: false,
  time_limit: 0,
  deadline: '',
  created: new Date().toISOString().split('T')[0],
  modified: new Date().toISOString().split('T')[0],
   };

  hasdeadline = false;
  haslimit = false;
  params = {};
  formExists = false;
  formId = 0;
  saveFailed = false;

  constructor(
    private readonly modal: NzModalService,
    private readonly route: ActivatedRoute,
    private readonly projectService: ProjectService<Project>
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.params = params;
      if (params["id"]) {
        this.formExists = true;
        this.formId = params["id"]
      }
      if (params["type"]) {
        this.project.type = params["type"];
      }
    });

    if (this.formExists && this.projectService.searchData(this.formId).length > 0) {
      this.project = this.projectService.searchData(this.formId)[0];
    }
    this.updateForm();
  }

  form = new FormGroup({
    title: new FormControl(this.project?.title),
    description: new FormControl(this.project?.description),
    type: new FormControl(this.project?.type == ProjectType.TEST),
    deadline: new FormControl(this.project?.deadline),
    haslimit: new FormControl(this.project?.time_chechkbox),
    limit: new FormControl(this.project?.time_limit)
  });

  setDeadline() {
    this.hasdeadline = !this.hasdeadline;
  }

  setLimit() {
    this.haslimit = !this.haslimit;
    this.project.time_chechkbox = this.haslimit;

  }

  updateForm() {
    if (this.project) {
      this.project.title = this.form.controls['title'].value!;
      this.project.description = this.form.controls['description'].value!;
      this.project.type = this.form.controls['type'].value! ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
      //this.project.deadline = this.form.controls['deadline'].value!;
      //this.project.time_chechkbox = this.form.controls['haslimit'].value!;
      //if (this.project.time_chechkbox) {
      //  this.project.time_limit = this.form.controls['limit'].value!;
      //}
    }
  }

  submitForm() {

    this.updateForm();

    //if (this.formExists) {
    //  if (this.projectService.updateWithCheck(this.formId, this.project)) {
    //    this.page! += 1;
    //    this.onsetPage(this.page!);
    //  }
    //  else {
    //    this.saveFailed = true;
    //  }
    //}
    //else {
    //  if (this.projectService.addWithCheck(this.project)) {
    //    this.page! += 1;
    //    this.onsetPage(this.page!);
    //  }
    //  else {
    //    this.saveFailed = true;
    //  }
    //}

    if (this.projectService.addWithCheck(this.project)) {
      this.page! += 1;
      this.onsetPage(this.page!);
      this.saveFailed = false;
    }
    else {
      this.saveFailed = true;
    }

    
    if (this.saveFailed) {
      this.modal.error({
        nzTitle: 'Faild to save form',
        nzContent: 'Some fields are not filled properly, please check and try again!'
      });
    }
    
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
