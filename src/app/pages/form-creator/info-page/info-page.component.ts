import { Component, OnInit, Input, Output, EventEmitter, signal, Signal, WritableSignal, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { Project, ProjectType } from '@interfaces/project';
import { JsonService } from '@services/json.service';
import { ProjectService } from '@services/project.service';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.less'],
  standalone: false,
})
export class InfoPageComponent implements OnInit, OnDestroy {
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() projectId = new EventEmitter<string>();
  @Output() formData = new EventEmitter<ProjectType>();

  private readonly _project: WritableSignal<any> = signal({
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
  public readonly project: Signal<any> = this._project.asReadonly();

  private readonly _formExists: WritableSignal<boolean> = signal(false);
  public readonly formExists: Signal<boolean> = this._formExists.asReadonly();

  private readonly _formId: WritableSignal<string> = signal('');
  public readonly formId: Signal<string> = this._formId.asReadonly();

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService<Project>,
    private readonly jsonService: JsonService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      if (params['id']) {
        this._formExists.set(true);
        this._formId.set(params['id']);

        const foundProject = this.projectService.searchData(this._formId())?.[0] || null;
        if (foundProject) {
          this._project.set(foundProject);
          this.initializeForm();
        }
      }

      if (params['type']) {
        const newType = params['type'] === ProjectType.TEST ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
        this._project.update(p => ({ ...p, type: newType }));
        this.form.patchValue({
          type: newType === ProjectType.TEST,
        });
      }
    });

    this.formData.emit(this._project().type);

    this.jsonService.getJsonData().subscribe((data) => {
      if (data && data.project) {
        this._project.update(p => ({ ...p, ...data.project }));
        this.initializeForm();
      }
    });
  }

  initializeForm(): void {
    const currentProject = this._project();
    this.form.patchValue({
      title: currentProject.title || '',
      description: currentProject.description || '',
      type: currentProject.type === ProjectType.TEST,
      deadline: currentProject.deadline || '',
      hasdeadline: currentProject.deadline_checkbox || false,
      haslimit: currentProject.time_checkbox || false,
      limit: currentProject.time_limit || 0,
    });
  }

  updateForm() {
    this._project.update(p => {
      const updated = { ...p };
      updated.title = this.form.controls['title'].value!;
      updated.description = this.form.controls['description'].value!;
      updated.type = this.form.controls['type'].value ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
      updated.deadline = this.form.controls['deadline'].value!;
      updated.deadline_checkbox = this.form.controls['hasdeadline'].value!;
      updated.time_checkbox = this.form.controls['haslimit'].value!;

      if (updated.time_checkbox) {
        updated.time_limit = this.form.controls['limit'].value!;
      }
      return updated;
    });

    this.formData.emit(this._project().type);
  }

  ngOnDestroy() {
    if (this._formExists() && this._formId() !== '') {
      this.projectId.emit(this._formId());
    } else {
      this.projectId.emit(this._project().id);
    }

    this.jsonService.clearJsonData();
  }

  submitForm() {
    if (this.form.invalid) {
      this._saveFailed.set(true);
      return;
    }

    this.updateForm();

    let currentProjectId: string;
    const currentProject = this._project(); // Kinyerjük a signal aktuális értékét

    if (this._formExists() && this._formId() !== '') {
      this.projectService.update(this._formId(), currentProject);
      currentProjectId = this._formId();
    } else {
      this.projectService.add(currentProject);
      this._project.set({ ...currentProject });
      currentProjectId = currentProject.id;
    }

    // Update the URL with &id=projectId
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: currentProjectId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    if (this.page !== undefined) {
      this.page += 1;
      this.onsetPage(this.page);
    }
    this._saveFailed.set(false);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
