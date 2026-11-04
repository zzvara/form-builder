import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { InfoPageComponent } from '@pages/form-creator/info-page/info-page.component';
import { Router, ActivatedRoute } from '@angular/router';
import type { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JsonService } from '@services/json.service';
import { ProjectService } from '@services/project.service';
import { ProjectType } from '@interfaces/project';
import { mockStorage, projectFixture } from '@app/testing/fixtures';

describe('InfoPageComponent', () => {
  let component: InfoPageComponent;
  let fixture: ComponentFixture<InfoPageComponent>;
  let params: BehaviorSubject<Params>;

  beforeEach(() => {
    mockStorage();
    params = new BehaviorSubject<Params>({});
    TestBed.configureTestingModule({
      imports: [InfoPageComponent],
      providers: [
        ...appConfig.providers,
        { provide: ActivatedRoute, useValue: { queryParams: params } },
      ],
    });
    fixture = TestBed.createComponent(InfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads an existing project from route parameters and handles a missing id', () => {
    const project = projectFixture({
      type: ProjectType.TEST,
      time_checkbox: true,
      time_limit: 30,
      deadline_checkbox: true,
      deadline: '2026-12-31',
    });
    const search = spyOn(TestBed.inject(ProjectService), 'searchData').and.returnValue([project]);
    params.next({ id: project.id });
    expect(component.formExists()).toBeTrue();
    expect(component.form.getRawValue()).toEqual(
      jasmine.objectContaining({
        title: 'Survey',
        type: true,
        haslimit: true,
        limit: 30,
        hasdeadline: true,
        deadline: '2026-12-31',
      }),
    );
    const error = spyOn(console, 'error');
    search.and.returnValue([]);
    params.next({ id: 'missing' });
    expect(error).toHaveBeenCalledWith('Project not found', 'missing');
  });

  it('selects the project type from the URL and initializes imported project data', () => {
    params.next({ type: ProjectType.TEST });
    expect(component.form.controls.type.value).toBeTrue();
    params.next({ type: ProjectType.QUESTIONNAIRE });
    expect(component.form.controls.type.value).toBeFalse();
    TestBed.inject(JsonService).setJsonData({
      project: projectFixture({ title: 'Imported', description: '' }),
    });
    expect(component.form.controls.title.value).toBe('Imported');
    expect(component.form.controls.description.value).toBe('');
    component.project = projectFixture({ title: '' });
    component.initializeForm();
    expect(component.form.controls.title.value).toBe('');
  });

  it('emits the project id and stops responding to route changes after destruction', () => {
    component.formId = 'existing';
    component.formExists.set(true);
    const emit = spyOn(component.projectId, 'emit');
    fixture.destroy();
    expect(emit).toHaveBeenCalledWith('existing');
    params.next({ type: ProjectType.TEST });
    expect(component.project.type).toBe(ProjectType.QUESTIONNAIRE);
  });

  it('keeps an invalid form on the current page without saving', () => {
    const add = spyOn(TestBed.inject(ProjectService), 'add');
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    component.page = 0;
    component.submitForm();
    expect(component.saveFailed()).toBeTrue();
    expect(component.page).toBe(0);
    expect(add).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('creates a project, updates its URL and advances after a valid submission', () => {
    const add = spyOn(TestBed.inject(ProjectService), 'add').and.callFake((project) => {
      project.id = 'new-id';
    });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const page = spyOn(component.setPage, 'emit');
    const type = spyOn(component.formData, 'emit');
    component.page = 0;
    component.form.patchValue({ title: 'Quiz', type: true, haslimit: true, limit: 15 });
    component.submitForm();
    expect(add).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'Quiz', type: ProjectType.TEST, time_limit: 15 }),
    );
    expect(navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({ queryParams: { id: 'new-id' }, replaceUrl: true }),
    );
    expect(page).toHaveBeenCalledWith(1);
    expect(type).toHaveBeenCalledWith(ProjectType.TEST);
    expect(component.saveFailed()).toBeFalse();
  });

  it('updates an existing project without creating a second one', () => {
    const service = TestBed.inject(ProjectService);
    const add = spyOn(service, 'add');
    const update = spyOn(service, 'update');
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.project = projectFixture();
    component.formId = component.project.id;
    component.formExists.set(true);
    component.page = 0;
    component.initializeForm();
    component.form.patchValue({ title: 'Updated' });
    component.submitForm();
    expect(update).toHaveBeenCalledWith(
      'project-1',
      jasmine.objectContaining({ title: 'Updated' }),
    );
    expect(add).not.toHaveBeenCalled();
  });
});
