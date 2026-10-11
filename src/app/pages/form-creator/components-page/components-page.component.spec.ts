import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ComponentsPageComponent } from '@pages/form-creator/components-page/components-page.component';
import { projectFixture, inputFixture, mockStorage, sectionFixture } from '@app/testing/fixtures';
import { ProjectService } from '@services/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UndoRedoEnum } from '@interfaces/undo-redo-type.enum';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';

describe('ComponentsPageComponent', () => {
  let component: ComponentsPageComponent;
  let fixture: ComponentFixture<ComponentsPageComponent>;

  beforeEach(() => {
    mockStorage();
    TestBed.configureTestingModule({
      imports: [ComponentsPageComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(ComponentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('compares adjacent versions and reports only changed fields', () => {
    const first = { versionNum: 1, created: '', project: projectFixture() };
    const second = { versionNum: 2, created: '', project: projectFixture({ title: 'Changed' }) };
    component.projectHistory.set([first, second]);
    component.currentVersionNum.set(1);
    expect(component.hasPreviousVersion()).toBeFalse();
    expect(component.hasNextVersion()).toBeTrue();
    expect(component.getDiffItems(first)).toEqual([]);
    expect(component.getDiffItems(second)).toEqual([
      { key: 'title', before: '"Survey"', after: '"Changed"' },
    ]);
    component.currentVersionNum.set(2);
    expect(component.hasPreviousVersion()).toBeTrue();
    expect(component.hasNextVersion()).toBeFalse();
  });

  it('blocks saving an invalid form and focuses its first invalid input', () => {
    const input = inputFixture('invalid', { data: { id: 'invalid', questionValue: '' } });
    spyOn(component.editComponent, 'isFormInvalid').and.returnValue(true);
    spyOn(component.editComponent, 'getAllFormInputs').and.returnValue([input]);
    const scroll = spyOn(component.editComponent, 'scrollToElement');
    const save = spyOn(component.editComponent, 'saveForm');
    expect(component.saveForm()).toBeFalse();
    expect(scroll).toHaveBeenCalledOnceWith('invalid');
    expect(save).not.toHaveBeenCalled();
  });
  
  it('saves a valid form before advancing', () => {
    spyOn(component.editComponent, 'isFormInvalid').and.returnValue(false);
    const save = spyOn(component.editComponent, 'saveForm');
    const emitted = spyOn(component.setPage, 'emit');
    component.page = 1;
    component.nextPage();
    expect(save).toHaveBeenCalledTimes(1);
    expect(emitted).toHaveBeenCalledOnceWith(2);
  });

  it('loads project versions and announces the latest available version', () => {
    const project = projectFixture();
    const service = TestBed.inject(ProjectService);
    service.add(project);
    service.update(project.id, { ...project, title: 'Changed' });
    component.projectId = project.id;
    const emit = spyOn(component.versionChange, 'emit');
    component.ngOnInit();
    expect(component.projectHistory()).toHaveSize(2);
    expect(emit).toHaveBeenCalledWith(2);
    spyOn(service, 'getProjectHistory').and.returnValue([]);
    component.ngOnInit();
    expect(component.currentVersionNum()).toBe(1);
  });

  it('reverts to adjacent and selected versions and reports missing versions', () => {
    const revert = spyOn(TestBed.inject(ProjectService), 'revertToVersion').and.returnValue(true);
    const reload = spyOn(component.editComponent, 'ngOnInit');
    const emit = spyOn(component.versionChange, 'emit');
    const error = spyOn(console, 'error');
    component.projectId = 'project';
    component.currentVersionNum.set(2);
    component.navigateVersion(-1);
    expect(revert).toHaveBeenCalledWith('project', 1);
    expect(component.currentVersionNum()).toBe(1);
    expect(emit).toHaveBeenCalledWith(1);
    expect(reload).toHaveBeenCalledTimes(1);
    revert.and.returnValue(false);
    component.selectVersion(99);
    expect(component.currentVersionNum()).toBe(1);
    expect(error).toHaveBeenCalledWith('Failed to revert to version', 99);
    component.projectId = undefined;
    component.selectVersion(3);
    component.currentVersionNum.set(undefined);
    component.navigateVersion(1);
    expect(revert).toHaveBeenCalledTimes(2);
  });

  for (const repeated of [true, false]) {
    it(`focuses an invalid ${repeated ? 'repeated section' : 'section'} when there is no invalid question`, () => {
      spyOn(component.editComponent, 'getAllFormInputs').and.returnValue([]);
      component.editComponent.editList = [{ id: 'section', data: sectionFixture() }];
      spyOn(component.editComponent, 'hasRepeatedSettingsErrorForEdit').and.returnValue(repeated);
      spyOn(component.editComponent, 'isComponentInvalid').and.returnValue(!repeated);
      const scroll = spyOn(component.editComponent, 'scrollToElement');
      component.jumpToFirstError();
      expect(scroll).toHaveBeenCalledWith('section');
    });
  }

  it('opens a change summary for the initial and subsequent versions', () => {
    const create = spyOn(TestBed.inject(NzModalService), 'create');
    const first = { versionNum: 1, created: '', project: projectFixture() };
    const second = { versionNum: 2, created: '', project: projectFixture({ title: 'Changed' }) };
    component.projectHistory.set([first, second]);
    component.openDiffModal(first);
    expect(create).toHaveBeenCalledWith(
      jasmine.objectContaining({ nzContent: ChangeSummaryComponent, nzData: { items: [] } }),
    );
    component.openDiffModal(second);
    expect(create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nzData: { items: [{ key: 'title', before: '"Survey"', after: '"Changed"' }] },
      }),
    );
    expect(component.trackByVersion(0, second)).toBe(2);
  });

  it('forwards undo commands and derives navigation availability from form validity', () => {
    const undo = spyOn(component.editComponent, 'undoRedo');
    const invalid = spyOn(component.editComponent, 'isFormInvalid').and.returnValue(true);
    component.onSectionInputsChange(UndoRedoEnum.UNDO);
    expect(undo).toHaveBeenCalledWith(UndoRedoEnum.UNDO);
    expect(component.isNextButtonDisabled).toBeTrue();
    invalid.and.returnValue(false);
    expect(component.isNextButtonDisabled).toBeFalse();
    component.editComponent = undefined!;
    expect(component.isNextButtonDisabled).toBeTrue();
    expect(component.saveForm()).toBeFalse();
    expect(() => component.jumpToFirstError()).not.toThrow();
  });
});
