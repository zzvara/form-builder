import { appConfig } from '@app/app.config';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { TestBed } from '@angular/core/testing';
import { FormCreatorComponent } from '@pages/form-creator/form-creator.component';
import { ProjectType } from '@interfaces/project';
import { mockStorage, projectFixture, sectionFixture } from '@app/testing/fixtures';
import type { ComponentFixture } from '@angular/core/testing';

describe('FormCreatorComponent', () => {
  let component: FormCreatorComponent;
  let store: FormBuilderStore;
  let fixture: ComponentFixture<FormCreatorComponent>;

  beforeEach(() => {
    mockStorage();
    TestBed.configureTestingModule({
      imports: [FormCreatorComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(FormCreatorComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(FormBuilderStore);
  });

  it('initializes a new project and follows the shared wizard step', () => {
    fixture.detectChanges();
    expect(store.project()?.type).toBe(ProjectType.QUESTIONNAIRE);
    expect(store.currentStep()).toBe(0);

    store.updateProject({ title: 'Survey' });
    component.toCompPage();
    expect(store.currentStep()).toBe(1);

    store.updateProject({
      editList: [{ id: 'section', data: sectionFixture('section') }],
    });
    store.isComponentsFormValid.set(true);
    component.toAnswPage();
    expect(store.currentStep()).toBe(2);
  });

  it('does not advance until the shared store reports valid information', () => {
    component.toCompPage();
    expect(store.currentStep()).toBe(0);
  });

  it('requires valid components before showing results', () => {
    store.project.set(
      projectFixture({
        title: 'Survey',
        editList: [{ id: 'section', data: sectionFixture('section') }],
      }),
    );
    store.currentStep.set(1);
    component.toAnswPage();
    expect(store.currentStep()).toBe(1);
  });

  it('returns to the information step through the store', () => {
    store.setPageStep(2);
    component.toInfoPage();
    expect(store.currentStep()).toBe(0);
  });
});
