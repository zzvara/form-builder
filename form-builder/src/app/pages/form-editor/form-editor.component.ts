import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Project, ProjectType } from 'src/app/items/project.interface';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.css'],
})
export class FormEditorComponent implements OnInit{
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();

  project: Project | null = null;

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
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      if (params['id']) {
        this.formExists = true;
        this.formId = Number(params['id']);
        const projects = JSON.parse(localStorage.getItem('') || '[]');
        this.project = projects.find((p: Project) => p.id === this.formId) || null;
        if (this.project) {
          this.initializeForm();
        }
      }
      if (params['type']) {
        if (this.project) {
          this.project.type = params['type'];
        }
      }
    });
  }

  initializeForm(): void {
    this.form = new FormGroup({
      title: new FormControl(this.project?.title || ''),
      description: new FormControl(this.project?.description || ''),
      type: new FormControl(this.project?.type === 'test'),
      deadline: new FormControl(this.project?.deadline || ''),
      haslimit: new FormControl(this.project?.time_chechkbox || false),
      limit: new FormControl(this.project?.time_limit || 0),
    });
  }

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    type: new FormControl(false),
    deadline: new FormControl(''),
    haslimit: new FormControl(false),
    limit: new FormControl(0),
  });
  setDeadline() {
    this.hasdeadline = !this.hasdeadline;
  }

  setLimit() {
    this.haslimit = !this.haslimit;
    if (this.project) {
      this.project.time_chechkbox = this.haslimit;
    }
  }

  updateForm() {
    if (this.project) {
      this.project.title = this.form.controls['title'].value!;
      this.project.description = this.form.controls['description'].value!;
      this.project.type = this.form.controls['type'].value! ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
    }
  }

  submitForm() {
    this.updateForm();
    if (this.project && this.project.id !== undefined) {
      if (this.projectService.updateWithCheck(this.project.id, this.project)) {
        this.page! += 1;
        this.onsetPage(this.page!);
        this.saveFailed = false;
      } else {
        this.saveFailed = true;
      }
    } else {
      this.saveFailed = true;
    }

    if (this.saveFailed) {
      this.modal.error({
        nzTitle: 'Failed to save form',
        nzContent: 'Some fields are not filled properly, please check and try again!',
      });
    }
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
