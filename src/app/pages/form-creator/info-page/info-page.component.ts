import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { Project, ProjectType } from '@interfaces/project';
import { TranslatePipe } from '@ngx-translate/core';
import { JsonService } from '@services/json.service';
import { ProjectService } from '@services/project.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
} from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { NzTimePickerComponent } from 'ng-zorro-antd/time-picker';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzLayoutComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    QuillEditorComponent,
    NzFormItemComponent,
    NzSwitchComponent,
    NzTooltipModule,
    NzDatePickerComponent,
    NzTimePickerComponent,
    NzButtonComponent,
    NzCheckboxComponent,
    NzInputModule,
    NzIconModule,
    NzFormModule,
    TranslatePipe,
  ],
})
export class InfoPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() projectId = new EventEmitter<string>();
  @Output() formData = new EventEmitter<ProjectType>();

  private readonly projectState = signal<Project>({
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
  });
  get project(): Project {
    return this.projectState();
  }
  set project(value: Project) {
    this.projectState.set(value);
  }

  readonly formExists = signal(false);
  formId = '';
  readonly saveFailed = signal(false);

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    type: new FormControl(false),
    deadline: new FormControl(''),
    hasdeadline: new FormControl(false),
    haslimit: new FormControl(false),
    limit: new FormControl(0),
  });
  params: Params = {};

  DateFormat = DateFormat;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService<Project>,
    private readonly jsonService: JsonService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.params = params;
      if (params['id']) {
        this.formExists.set(true);
        this.formId = params['id'];

        const project = this.projectService.searchData(this.formId)?.[0];
        if (!project) {
          console.error('Project not found', this.formId);
          return;
        }
        this.project = project;
        this.initializeForm();
      }
      if (params['type']) {
        this.project.type =
          params['type'] === ProjectType.TEST ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
        this.project = { ...this.project };
        this.form.patchValue({
          type: this.project.type === ProjectType.TEST,
        });
      }
    });

    this.formData.emit(this.project.type);

    this.jsonService.getJsonData().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
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
    this.project.type = this.form.controls['type'].value
      ? ProjectType.TEST
      : ProjectType.QUESTIONNAIRE;
    this.project.deadline = this.form.controls['deadline'].value!;
    this.project.deadline_checkbox = this.form.controls['hasdeadline'].value!;
    this.project.time_checkbox = this.form.controls['haslimit'].value!;
    if (this.project.time_checkbox) {
      this.project.time_limit = this.form.controls['limit'].value!;
    }
    this.project = { ...this.project };
    this.formData.emit(this.project.type);
  }

  ngOnDestroy() {
    if (this.formExists() && this.formId !== '') {
      this.projectId.emit(this.formId);
    } else {
      this.projectId.emit(this.project.id);
    }

    this.jsonService.clearJsonData();
  }

  submitForm() {
    if (this.form.invalid) {
      this.saveFailed.set(true);
      return;
    }

    this.updateForm();

    let projectId: string;

    if (this.formExists() && this.formId !== '') {
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
    this.saveFailed.set(false);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
