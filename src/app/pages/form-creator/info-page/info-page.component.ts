import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal, WritableSignal, OnDestroy, DestroyRef, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { ProjectType } from '@interfaces/project';
import { TranslatePipe } from '@ngx-translate/core';
import { JsonService } from '@services/json.service';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { RoutePath } from '@app/shared/models/route-path.model';
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
  private readonly _formExists: WritableSignal<boolean> = signal(false);
  public readonly formExists: Signal<boolean> = this._formExists.asReadonly();

  private readonly _saveFailed: WritableSignal<boolean> = signal(false);
  public readonly saveFailed: Signal<boolean> = this._saveFailed.asReadonly();

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

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly jsonService: JsonService,
    public store: FormBuilderStore
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.params = params;
      if (params['id']) {
        this._formExists.set(true);
        if (this.store.projectId() !== params['id']) {
          this.store.setProject(params['id']);
        }
        this.initializeForm();
      } else {
        const newType = params['type'] === ProjectType.TEST ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
        if (!this.store.project()) {
          this.store.initNewProject(newType);
        } else if (this.store.project()?.type !== newType) {
          this.store.updateProject({ type: newType });
        }
        this.form.patchValue(
          {
            type: newType === ProjectType.TEST,
          },
          { emitEvent: false }
        );
        this.initializeForm();
      }
    });

    this.jsonService
      .getJsonData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data && data.project) {
          this.store.updateProject(data.project);
          this.initializeForm();
        }
      });

    this.initializeForm();
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.form.valid) {
        this.updateForm();
      }
    });
  }

  initializeForm(): void {
    const currentProject = this.store.project();
    if (!currentProject) {
      this.router.navigate([RoutePath.NEW]);
      return;
    }

    this.form.patchValue(
      {
        title: currentProject.title || '',
        description: currentProject.description || '',
        type: currentProject.type === ProjectType.TEST,
        deadline: currentProject.deadline || '',
        hasdeadline: currentProject.deadline_checkbox || false,
        haslimit: currentProject.time_checkbox || false,
        limit: currentProject.time_limit || 0,
      },
      { emitEvent: false }
    );
  }

  updateForm() {
    this.store.updateProject({
      title: this.form.controls['title'].value || '',
      description: this.form.controls['description'].value || '',
      type: this.form.controls['type'].value ? ProjectType.TEST : ProjectType.QUESTIONNAIRE,
      deadline: this.form.controls['deadline'].value || '',
      deadline_checkbox: this.form.controls['hasdeadline'].value || false,
      time_checkbox: this.form.controls['haslimit'].value || false,
      time_limit: this.form.controls['haslimit'].value ? this.form.controls['limit'].value || 0 : 0,
    });
  }

  ngOnDestroy() {
    this.jsonService.clearJsonData();
  }

  submitForm() {
    if (this.form.invalid) {
      this._saveFailed.set(true);
      return;
    }

    this.updateForm();
    this.store.saveProject();

    const currentProjectId = this.store.project()?.id;
    if (currentProjectId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { id: currentProjectId },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }

    this._saveFailed.set(false);
    this.store.nextPage();
  }
}
