import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { ComponentsPageComponent } from '@pages/form-creator/components-page/components-page.component';
import { projectFixture, mockStorage, sectionFixture } from '@app/testing/fixtures';
import { ProjectService } from '@services/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UndoRedoEnum } from '@interfaces/undo-redo-type.enum';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';

describe('ComponentsPageComponent', () => {
  let component: ComponentsPageComponent;
  let fixture: ComponentFixture<ComponentsPageComponent>;
  let store: FormBuilderStore;

  beforeEach(() => {
    mockStorage();
    TestBed.configureTestingModule({
      imports: [ComponentsPageComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(ComponentsPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(FormBuilderStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads project history and exposes version differences', () => {
    const project = projectFixture();
    const service = TestBed.inject(ProjectService);
    service.add(project);
    service.update(project.id, { ...project, title: 'Changed' });
    service.update(project.id, { ...project, title: 'Latest' });
    store.setProject(project.id);
    component.ngOnInit();

    expect(component.projectHistory().length).toBeGreaterThanOrEqual(2);
    expect(component.hasPreviousVersion()).toBeTrue();
    expect(component.getDiffItems(component.projectHistory().at(-1)!)).toEqual([
      { key: 'title', before: '"Changed"', after: '"Latest"' },
    ]);
  });

  it('saves the current project and advances using the shared store', () => {
    store.project.set(
      projectFixture({
        editList: [{ id: 'section', data: sectionFixture('section') }],
      }),
    );
    store.currentStep.set(1);
    store.isComponentsFormValid.set(true);
    const save = spyOn(store, 'saveProject').and.callThrough();

    component.nextPage();

    expect(save).toHaveBeenCalled();
    expect(store.currentStep()).toBe(2);
  });

  it('opens change summaries for the selected version', () => {
    const create = spyOn(TestBed.inject(NzModalService), 'create');
    const project = projectFixture();
    const service = TestBed.inject(ProjectService);
    service.add(project);
    service.update(project.id, { ...project, title: 'Changed' });
    service.update(project.id, { ...project, title: 'Latest' });
    store.setProject(project.id);
    component.ngOnInit();
    const second = component.projectHistory().at(-1)!;

    component.openDiffModal(second);

    expect(create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nzContent: ChangeSummaryComponent,
        nzData: { items: [{ key: 'title', before: '"Changed"', after: '"Latest"' }] },
      }),
    );
  });

  it('forwards undo and redo commands to the shared store', () => {
    const undo = spyOn(store, 'undoEdit');
    const redo = spyOn(store, 'redoEdit');

    component.onSectionInputsChange(UndoRedoEnum.UNDO);
    component.onSectionInputsChange(UndoRedoEnum.REDO);

    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).toHaveBeenCalledTimes(1);
  });
});
