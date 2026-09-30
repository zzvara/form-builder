import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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
export class InfoPageComponent implements OnInit, OnDestroy {
  readonly page = input<number>();
  readonly setPage = output<number>();
  readonly projectId = output<string>();
  readonly formData = output<ProjectType>();

  // The project object is shared with the ProjectService and updated in place (the version history relies on it),
  // so every set notifies the consumers
  readonly project = signal<Project>(
    {
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
    },
    { equal: () => false },
  );

  readonly formExists = signal(false);
  readonly formId = signal('');
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
  readonly hasDeadline = toSignal(this.form.controls.hasdeadline.valueChanges, {
    initialValue: this.form.controls.hasdeadline.value,
  });
  readonly hasLimit = toSignal(this.form.controls.haslimit.valueChanges, {
    initialValue: this.form.controls.haslimit.value,
  });
  params: Params = {};

  DateFormat = DateFormat;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService<Project>,
    private readonly jsonService: JsonService,
  ) {
    effect(() => {
      const data = this.jsonService.jsonData();
      // TODO: Inconsistent function, sometimes works and sometimes doesn't :)
      if (data) {
        untracked(() => {
          this.project.update((project) => ({ ...project, ...data.project }));
          this.initializeForm();
        });
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.params = params;
      if (params['id']) {
        this.formExists.set(true);
        this.formId.set(params['id']);
        this.projectId.emit(params['id']);

        const project = this.projectService.searchData(params['id'])?.[0];
        if (project) {
          this.project.set(project);
          this.initializeForm();
        }
      }
      if (params['type']) {
        const project = this.project();
        project.type =
          params['type'] === ProjectType.TEST ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
        this.project.set(project);
        this.form.patchValue({
          type: project.type === ProjectType.TEST,
        });
      }
    });

    this.formData.emit(this.project().type);
  }
  initializeForm(): void {
    const project = this.project();
    this.form.patchValue({
      title: project.title || '',
      description: project.description || '',
      type: project.type === ProjectType.TEST,
      deadline: project.deadline || '',
      hasdeadline: project.deadline_checkbox || false,
      haslimit: project.time_checkbox || false,
      limit: project.time_limit || 0,
    });
  }

  updateForm() {
    const controls = this.form.controls;
    const project = this.project();
    project.title = controls['title'].value!;
    project.description = controls['description'].value!;
    project.type = controls['type'].value ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
    project.deadline = controls['deadline'].value!;
    project.deadline_checkbox = controls['hasdeadline'].value!;
    project.time_checkbox = controls['haslimit'].value!;
    if (project.time_checkbox) {
      project.time_limit = controls['limit'].value!;
    }
    this.project.set(project);
    this.formData.emit(project.type);
  }

  ngOnDestroy() {
    this.jsonService.clearJsonData();
  }

  submitForm() {
    if (this.form.invalid) {
      this.saveFailed.set(true);
      return;
    }

    this.updateForm();

    let projectId: string;
    const project = this.project();

    if (this.formExists() && this.formId() !== '') {
      this.projectService.update(this.formId(), project);
      projectId = this.formId();
    } else {
      // The project service assigns the id of the new project
      this.projectService.add(project);
      projectId = project.id;
    }
    this.projectId.emit(projectId);

    // Update the URL with &id=projectId
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: projectId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.onsetPage(this.page()! + 1);
    this.saveFailed.set(false);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
