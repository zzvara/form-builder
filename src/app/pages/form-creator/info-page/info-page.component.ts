import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectType } from '@interfaces/project';
import { JsonService } from '@services/json.service';
import { ProjectService } from '@services/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.less'],
  standalone: false,
})
export class InfoPageComponent implements OnInit {
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() projectId = new EventEmitter<string>();
  @Output() formData = new EventEmitter<ProjectType>();

  project = {
    id: '',
    title: '',
    description: '',
    type: ProjectType.QUESTIONNAIRE,
    time_checkbox: false,
    deadline_checkbox: false,
    time_limit: 0,
    deadline: '',
    created: new Date().toISOString().split('T')[0],
    modified: new Date().toISOString().split('T')[0],
  };

  formExists = false;
  formId = '';
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
    private readonly router: Router,
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
        this.formId = params['id'];
        this.project = this.projectService.searchData(this.formId)?.[0] || null;
        if (this.project) {
          this.initializeForm();
        }
      }
      if (params['type']) {
        this.project.type = params['type'] === ProjectType.TEST ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
        this.form.patchValue({
          type: this.project.type === ProjectType.TEST,
        });
      }
    });

    this.formData.emit(this.project.type);

    this.jsonService.getJsonData().subscribe((data) => {
      // TODO: Inconsistent function, sometimes works and sometimes doesn't :)
      if (data) {
        this.project = { ...this.project, ...data.project };
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
    this.formData.emit(this.project.type);
  }

  ngOnDestroy() {
    if (this.formExists && this.formId !== '') {
      this.projectId.emit(this.formId);
    } else {
      this.projectId.emit(this.project.id);
    }

    this.jsonService.clearJsonData();
  }

  submitForm() {
    if (this.form.invalid) {
      this.saveFailed = true;
      return;
    }

    this.updateForm();

    let projectId: string;

    if (this.formExists && this.formId !== '') {
      this.projectService.update(this.formId, this.project);
      projectId = this.formId;
    } else {
      this.projectService.add(this.project);
      projectId = this.project.id;
    }

    // Update the URL with &id=projectId
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: projectId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.page! += 1;
    this.onsetPage(this.page!);
    this.saveFailed = false;
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
