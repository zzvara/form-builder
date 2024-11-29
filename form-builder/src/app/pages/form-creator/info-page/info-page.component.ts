import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectService } from '../../../services/project.service';
import { JsonService } from '../../../services/json.service';
import { Project, ProjectType } from 'src/app/interfaces/project';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() projectId = new EventEmitter<number>();

  project = {
    id: 0,
    title: '',
    description: '',
    type: ProjectType.QUESTIONNAIRE ,
    time_checkbox: false,
    deadline_checkbox: false,
    time_limit: 0,
    deadline: '',
    created: new Date().toISOString().split('T')[0],
    modified: new Date().toISOString().split('T')[0],
  };

  formExists = false;
  formId = 0;
  saveFailed = false;

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    type: new FormControl(false),
    deadline: new FormControl(''),
    hasdeadline: new FormControl(false),
    haslimit: new FormControl(false),
    limit: new FormControl(0),
  });
  params: any = {};

  constructor(
    private readonly modal: NzModalService,
    private readonly route: ActivatedRoute,
    private readonly projectService: ProjectService<Project>,
    private readonly jsonService: JsonService
  ) {}

  /*ngOnChanges(changes: SimpleChanges): void {

  }*/

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      if (params['id']) {
        this.formExists = true;
        this.formId = Number(params['id']);
        this.project = this.projectService.searchData(this.formId)[0] || null;
        if (this.project) {
          this.initializeForm();
        }
      }
      if (params['type']) {

        this.project.type = params['type'] === 'TEST' ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
        this.form.patchValue({
          type: this.project.type === ProjectType.TEST
        });
      }
    });

    this.jsonService.getJsonData().subscribe((data: any) => {
      if (data) {
        this.project = { ...this.project, ...data };
        this.initializeForm();
      }
    });
  }

  initializeForm(): void {
    this.form.patchValue({
      title: this.project.title || '',
      description: this.project.description || '',
      type: this.project.type === ProjectType.TEST,
      deadline: this.project.deadline || '',
      hasdeadline: this.project.deadline_checkbox || false,
      haslimit: this.project.time_checkbox || false,
      limit: this.project.time_limit || 0,
    });
  }

  updateForm() {
    this.project.title = this.form.controls['title'].value!;
    this.project.description = this.form.controls['description'].value!;
    this.project.type = this.form.controls['type'].value ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
    this.project.deadline = this.form.controls['deadline'].value!;
    this.project.deadline_checkbox = this.form.controls['hasdeadline'].value!;
    this.project.time_checkbox = this.form.controls['haslimit'].value!;
    if (this.project.time_checkbox) {
      this.project.time_limit = this.form.controls['limit'].value!;
    }
  }

  ngOnDestroy() {
    if (this.formExists && this.formId !== 0) {
      this.projectId.emit(this.formId);
    } else {
      this.projectId.emit(this.project.id);
    }
  }

  submitForm() {
    console.log('Form validity:', this.form.valid);
    if (this.form.invalid) {
      this.saveFailed = true;
      console.log('Form is invalid, validation failed');
      return;
    }
    this.updateForm();
    if (this.formExists && this.formId !== 0) {
      this.projectService.update(this.formId, this.project);
    } else {
      this.projectService.add(this.project);
    }
    this.page! += 1;
    this.onsetPage(this.page!);
    this.saveFailed = false;
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
