import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EditComponent } from '@pages/edit/edit.component';
import type { EditList } from './interfaces/edit-list';
import type { FormInputData } from '@interfaces/form-input-data';
import type { SectionList } from './interfaces/section-list';
import { LayoutEnum } from './interfaces/layout-enum';
import { ProjectService } from '@services/project.service';
import { ComponentService } from '@services/component.service';
import { UndoRedoService } from '@services/undo-redo.service';
import { UndoRedoEnum } from '@interfaces/undo-redo-type.enum';
import { ProjectType, type Project } from '@interfaces/project';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function project(editList?: EditList[]): Project {
    return {
      id: 'project',
      title: 'Project',
      description: '',
      type: ProjectType.TEST,
      time_checkbox: false,
      deadline_checkbox: false,
      time_limit: 0,
      deadline: '',
      created: '',
      modified: '',
      editList,
    };
  }

  const previousComponents: EditList[] = [
    {
      id: 'previous-input',
      data: {
        title: 'Question',
        type: 'InputComponent',
        customTitle: 'Previous question',
        data: { id: 'previous-input', questionValue: 'Question' },
        codeEditor: { enabled: false },
      },
    },
  ];

  for (const emptyProject of [project(), project([]), undefined]) {
    it(`clears shared components and history when opening ${emptyProject ? (emptyProject.editList ? 'an empty project' : 'a new project') : 'a missing project'}`, () => {
      spyOn(TestBed.inject(ProjectService), 'getProjectVersion').and.returnValue(emptyProject);
      const components = TestBed.inject(ComponentService);
      const history = TestBed.inject<UndoRedoService<EditList[]>>(UndoRedoService);
      components.component$.next(previousComponents);
      history.saveState(previousComponents);
      component.names = ['Previous question'];

      fixture.componentRef.setInput('projectId', 'next-project');
      fixture.detectChanges();

      expect(component.editList).toEqual([]);
      expect(component.names).toEqual([]);
      expect(components.component$.value).toEqual([]);
      expect(history.canUndo()).toBeFalse();
      expect(history.canRedo()).toBeFalse();

      component.undoRedo(UndoRedoEnum.UNDO);
      expect(component.editList).toEqual([]);
      component.undoRedo(UndoRedoEnum.REDO);
      expect(component.editList).toEqual([]);
    });
  }

  it('starts a newly mounted editor without components from the previous editor', () => {
    fixture.destroy();
    TestBed.inject(ComponentService).component$.next(previousComponents);
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.editList).toEqual([]);
    expect(TestBed.inject(ComponentService).component$.value).toEqual([]);
  });

  it('keeps an empty selected version empty when the current project has components', () => {
    spyOn(TestBed.inject(ProjectService), 'getProjectVersion').and.returnValue(project([]));
    spyOn(TestBed.inject(ProjectService), 'searchData').and.returnValue([
      project(previousComponents),
    ]);
    fixture.componentRef.setInput('projectId', 'project');
    fixture.detectChanges();

    expect(component.getAllFormInputs()).toEqual([]);
    expect(component.editList).toEqual([]);
  });

  it('does not reload the project when toggling inline editing', () => {
    const load = spyOn(TestBed.inject(ProjectService), 'getProjectVersion').and.returnValue(
      project(),
    );
    fixture.componentRef.setInput('projectId', 'project');
    fixture.detectChanges();
    TestBed.inject(ComponentService).component$.next(previousComponents);
    load.calls.reset();

    fixture.componentRef.setInput('inlineEdit', { enabled: false });
    fixture.detectChanges();

    expect(load).not.toHaveBeenCalled();
    expect(component.editList).toEqual(previousComponents);
  });

  it('unwraps a top-level input when moving it into a section', () => {
    const input: FormInputData = {
      title: 'Question',
      type: 'InputComponent',
      data: { id: 'input', questionValue: 'Question' },
      codeEditor: { enabled: false },
    };
    const wrapped: EditList = { id: 'input', data: input };
    const section: SectionList = {
      sectionId: 'section',
      type: 'SectionComponent',
      layout: LayoutEnum.VERTICAL,
      sectionInputs: [],
      data: { id: 'section', sectionId: 'section' },
      codeEditor: { enabled: false },
      reorderEnabled: false,
    };
    component.editList = [wrapped, { id: 'section', data: section }];
    component.dropIntoSection({
      previousContainer: { id: 'sectionDropList', data: component.editList },
      container: { id: 'section', data: section.sectionInputs },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: wrapped },
    } as Parameters<EditComponent['dropIntoSection']>[0]);

    expect(section.sectionInputs).toEqual([input]);
    expect(component.editList.map((item) => item.id)).toEqual(['section']);
  });
});
