import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormCreatorComponent } from '@pages/form-creator/form-creator.component';
import { ProjectType } from '@interfaces/project';
import type { ComponentsPageComponent } from './components-page/components-page.component';
import type { EditComponent } from '@pages/edit/edit.component';

describe('FormCreatorComponent', () => {
  let component: FormCreatorComponent;
  let fixture: ComponentFixture<FormCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormCreatorComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(FormCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('derives wizard validity from its child forms and saves before showing results', () => {
    expect(component.checkInfoForm()).toBeFalse();
    component.infoPageComponent!.form.controls.title.setValue('Survey');
    expect(component.checkInfoForm()).toBeTrue();
    const edit = jasmine.createSpyObj<EditComponent>('edit', ['isFormInvalid']);
    const page = jasmine.createSpyObj<ComponentsPageComponent>('page', ['saveForm'], {
      editComponent: edit,
    });
    component.componentsPageComponent = page;
    edit.isFormInvalid.and.returnValue(true);
    component.toAnswPage();
    expect(component.page()).toBe(0);
    expect(page.saveForm).not.toHaveBeenCalled();
    edit.isFormInvalid.and.returnValue(false);
    page.saveForm.and.returnValue(true);
    component.toAnswPage();
    expect(component.page()).toBe(2);
    expect(page.saveForm).toHaveBeenCalledTimes(1);
    component.toAnswPage();
    expect(component.page()).toBe(2);
    component.handleFormData(ProjectType.QUESTIONNAIRE);
    expect(component.projectType()).toBe(ProjectType.QUESTIONNAIRE);
    component.setPage(1);
    expect(component.page()).toBe(1);
  });

  it('uses the last known validity when child pages are no longer mounted', () => {
    component.infoPageComponent = undefined;
    component.componentsPageComponent = undefined;
    expect(component.checkInfoForm()).toBeFalse();
    expect(component.checkComponentsForm()).toBeFalse();
  });

  it('requires valid information before moving to the component page', () => {
    spyOn(component, 'checkInfoForm').and.returnValue(false);
    component.toCompPage();
    expect(component.page()).toBe(0);
    component.checkInfoForm = () => true;
    const submit = spyOn(component.infoPageComponent!, 'submitForm');
    component.toCompPage();
    expect(submit).toHaveBeenCalled();
    expect(component.page()).toBe(1);
  });

  it('advances at most to results and can return to information', () => {
    component.nextPage();
    component.nextPage();
    component.nextPage();
    expect(component.page()).toBe(2);
    component.setPage(3);
    expect(component.page()).toBe(2);
    component.toInfoPage();
    expect(component.page()).toBe(0);
  });

  it('publishes selected project and version state', () => {
    component.setProjectId('project');
    component.setVersionNum(3);
    expect(component.projectId()).toBe('project');
    expect(component.currentVersionNum()).toBe(3);
  });
});
