import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { InfoPageComponent } from '@pages/form-creator/info-page/info-page.component';
import { Router, ActivatedRoute } from '@angular/router';
import type { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProjectService } from '@services/project.service';
import { ProjectType } from '@interfaces/project';
import { mockStorage, projectFixture } from '@app/testing/fixtures';

describe('InfoPageComponent', () => {
  let component: InfoPageComponent;
  let fixture: ComponentFixture<InfoPageComponent>;
  let params: BehaviorSubject<Params>;
  let store: FormBuilderStore;

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
    store = TestBed.inject(FormBuilderStore);
    fixture.detectChanges();
  });

  it('initializes a new project from route parameters', () => {
    expect(store.project()?.type).toBe(ProjectType.QUESTIONNAIRE);
    store.initNewProject(ProjectType.TEST);
    params.next({ type: ProjectType.TEST });
    expect(component.form.controls.type.value).toBeTrue();
  });

  it('loads an existing project from route parameters into the store and form', () => {
    const project = projectFixture({
      type: ProjectType.TEST,
      time_checkbox: true,
      time_limit: 30,
      deadline_checkbox: true,
      deadline: '2026-12-31',
    });
    TestBed.inject(ProjectService).add(project);

    params.next({ id: project.id });

    expect(component.formExists()).toBeTrue();
    expect(store.project()?.id).toBe(project.id);
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
  });

  it('updates the shared project as the info form changes', () => {
    component.form.patchValue({ title: 'Updated survey', haslimit: true, limit: 15 });
    expect(store.project()?.title).toBe('Updated survey');
    expect(store.project()?.time_checkbox).toBeTrue();
    expect(store.project()?.time_limit).toBe(15);
  });

  it('keeps an invalid form on the current step without saving', () => {
    const add = spyOn(TestBed.inject(ProjectService), 'add');
    component.submitForm();

    expect(component.saveFailed()).toBeTrue();
    expect(store.currentStep()).toBe(0);
    expect(add).not.toHaveBeenCalled();
  });

  it('saves valid information and advances through the shared store', () => {
    const add = spyOn(TestBed.inject(ProjectService), 'add').and.callFake((project) => {
      project.id = 'new-id';
    });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.form.patchValue({ title: 'Quiz', type: true, haslimit: true, limit: 15 });

    component.submitForm();

    expect(add).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'Quiz', type: ProjectType.TEST, time_limit: 15 }),
    );
    expect(navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({ queryParams: { id: 'new-id' }, replaceUrl: true }),
    );
    expect(store.currentStep()).toBe(1);
    expect(component.saveFailed()).toBeFalse();
  });
});
