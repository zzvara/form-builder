import { appConfig } from '@app/app.config';
import { SimpleChange } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { EditComponent } from '@pages/edit/edit.component';
import type { EditList } from './interfaces/edit-list';
import type { FormInputData } from '@interfaces/form-input-data';
import type { SectionList } from './interfaces/section-list';
import { LayoutEnum } from './interfaces/layout-enum';
import { inputFixture, mockStorage, projectFixture, sectionFixture } from '@app/testing/fixtures';

import { ProjectService } from '@services/project.service';
import { ComponentService } from '@services/component.service';
import { UndoRedoService } from '@services/undo-redo.service';
import { UndoRedoEnum } from '@interfaces/undo-redo-type.enum';
import { ProjectType, type Project } from '@interfaces/project';

import type { RepeatedSectionList } from './interfaces/section-list';
import type { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalService } from '@services/modal.service';
import type { InputHolderComponent } from '@components/input-holder/input-holder.component';

function dropEvent<T>(
  container: { id: string; data: T[] },
  previousContainer: { id: string; data: EditList[] | FormInputData[] },
  data: EditList | FormInputData,
  previousIndex = 0,
  currentIndex = 0,
): CdkDragDrop<T[], EditList[] | FormInputData[], EditList | FormInputData> {
  return {
    container,
    previousContainer,
    item: { data },
    previousIndex,
    currentIndex,
  } as CdkDragDrop<T[], EditList[] | FormInputData[], EditList | FormInputData>;
}

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(() => {
    mockStorage();
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

    expect(section.sectionInputs).toEqual([
      { ...input, data: { ...input.data, sectionId: 'section' } },
    ]);
    expect(component.editList.map((item) => item.id)).toEqual(['section']);
  });

  it('loads a saved version without editing the stored snapshot', () => {
    const stored = projectFixture({ editList: [{ id: '', data: inputFixture('') }] });
    const load = spyOn(TestBed.inject(ProjectService), 'getProjectVersion').and.returnValue(stored);
    component.projectId = stored.id;
    component.versionNum = 3;
    component.ngOnChanges({
      projectId: new SimpleChange(undefined, stored.id, true),
      versionNum: new SimpleChange(undefined, 3, true),
    });
    expect(load).toHaveBeenCalledWith(stored.id, 3);
    expect(component.editList[0].id).toBeTruthy();
    expect(component.getAllFormInputs()[0].data!.id).toBeTruthy();
    expect(stored.editList![0].id).toBe('');
    expect(stored.editList![0].data.data!.id).toBe('');
  });

  it('saves a copy so later draft edits cannot mutate the saved project', () => {
    const stored = projectFixture();
    spyOn(TestBed.inject(ProjectService), 'searchData').and.returnValue([stored]);
    const update = spyOn(TestBed.inject(ProjectService), 'update');
    component.projectId = stored.id;
    component.editList = [{ id: 'one', data: inputFixture('one', { customTitle: 'Name' }) }];
    component.saveForm();
    component.editList[0].data.customTitle = 'Unsaved';
    expect(stored.editList![0].data.customTitle).toBe('Name');
    expect(update).toHaveBeenCalledWith(stored.id, stored);
  });

  it('flattens section inputs and removes only the requested input', () => {
    const section = sectionFixture('section', [inputFixture('nested'), inputFixture('retained')]);
    component.editList = [
      { id: 'top', data: inputFixture('top') },
      { id: 'section', data: section },
    ];
    expect(component.getAllFormInputs().map((input) => input.data!.id)).toEqual([
      'top',
      'nested',
      'retained',
    ]);
    component.removeSectionComponent(section, 'nested');
    expect(component.getAllFormInputs().map((input) => input.data!.id)).toEqual([
      'top',
      'retained',
    ]);
    component.removeEditComponent(component.editList[0]);
    expect(component.getSectionIds()).toEqual(['section']);
    expect(component.getAllFormInputs().map((input) => input.data!.id)).toEqual(['retained']);
  });

  it('restores removals with undo and reapplies them with redo', () => {
    component.editList = [{ id: 'one', data: inputFixture() }];
    TestBed.inject(UndoRedoService).saveState(component.editList);
    component.removeEditComponent(component.editList[0]);
    expect(component.editList).toEqual([]);
    component.undoRedo(UndoRedoEnum.UNDO);
    expect(component.editList.map((item) => item.id)).toEqual(['one']);
    component.undoRedo(UndoRedoEnum.REDO);
    expect(component.editList).toEqual([]);
  });

  it('changes section layout and limits connections while reordering', () => {
    const section = sectionFixture('section', [inputFixture('a'), inputFixture('b')]);
    component.editList = [{ id: 'section', data: section }];
    expect(component.getSectionInputStyle(section)).toEqual({ width: '100%' });
    component.sectionLayoutChange(section);
    expect(section.layout).toBe(LayoutEnum.HORIZONTAL);
    expect(component.getSectionInputStyle(section)).toEqual({ width: '49%' });
    expect(component.getSectionDropListConnectedTo(section)).toEqual([
      'section',
      'sectionDropList',
    ]);
    section.reorderEnabled = true;
    expect(component.getSectionDropListConnectedTo(section)).toEqual([]);
  });

  it('validates repeat counts and references to preceding numeric inputs', () => {
    const repeated: RepeatedSectionList = {
      ...sectionFixture('repeat'),
      type: 'RepeatedSectionComponent',
      repeatByOther: false,
      repeatTimes: 0,
      referencableInputs: [],
      referencedInput: undefined,
    };
    component.editList = [
      {
        id: 'number',
        data: inputFixture('number', { type: 'NumberInputComponent', customTitle: 'Count' }),
      },
      { id: 'repeat', data: repeated },
      {
        id: 'later',
        data: inputFixture('later', { type: 'NumberInputComponent', customTitle: 'Later' }),
      },
    ];
    expect(component.hasRepeatedSettingsError(repeated)).toBeTrue();
    repeated.repeatTimes = 2;
    expect(component.hasRepeatedSettingsError(repeated)).toBeFalse();
    expect(component.getRepeatedSettingsSummary(repeated)).toBe('2x');
    component.openRepeatedSettings(repeated);
    expect(repeated.referencableInputs).toEqual(['Count']);
    repeated.repeatByOther = true;
    repeated.referencedInput = 'Later';
    expect(component.hasRepeatedSettingsError(repeated)).toBeTrue();
    repeated.referencedInput = 'Count';
    expect(component.hasRepeatedSettingsError(repeated)).toBeFalse();
  });

  it('allows draft questions but rejects saved questions without text', () => {
    expect(
      component.isInputInvalid(inputFixture('a', { data: { questionValue: '  ' } })),
    ).toBeTrue();
    expect(
      component.isInputInvalid(inputFixture('a', { data: { questionValue: '', draft: true } })),
    ).toBeFalse();
    expect(component.isInputInvalid(inputFixture())).toBeFalse();
  });

  it('stops accepting shared component updates after destruction', () => {
    fixture.destroy();
    TestBed.inject(ComponentService).component$.next([{ id: 'later', data: inputFixture() }]);
    expect(component.editList).toEqual([]);
  });

  it('copies palette inputs, assigns ids and starts them as drafts', () => {
    const palette = inputFixture('', { customTitle: 'Answer' });
    const target = { id: 'sectionDropList', data: component.editList };
    component.dropIntoEdit(dropEvent(target, { id: 'palette', data: [palette] }, palette));
    const added = component.getAllFormInputs()[0];
    expect(added.data).toEqual(
      jasmine.objectContaining({ id: jasmine.any(String), sectionId: target.id, draft: true }),
    );
    expect(added.data!.id).toBeTruthy();
    expect(added.customTitle).toBe('Answer');
    expect(added).not.toBe(palette);
    expect(palette.data!.id).toBe('');
  });

  for (const type of ['SectionComponent', 'RepeatedSectionComponent'] as const) {
    it(`creates a usable ${type} from the actual sidebar definition`, () => {
      const palette = component.sideBarData[1].groupContents.find((item) => item.type === type)!;
      component.dropIntoEdit(
        dropEvent(
          { id: 'sectionDropList', data: component.editList },
          { id: 'palette', data: [palette] },
          palette,
        ),
      );
      const section = component.editList[0].data;
      expect(section).toEqual(
        jasmine.objectContaining({ type, layout: LayoutEnum.VERTICAL, sectionInputs: [] }),
      );
      expect(component.getSectionIds()).toEqual([component.editList[0].id]);
      expect(palette.data).toBeNull();
    });
  }

  it('reorders top-level questions without changing their identifiers', () => {
    component.editList = [
      { id: 'a', data: inputFixture('a') },
      { id: 'b', data: inputFixture('b') },
    ];
    const target = { id: 'sectionDropList', data: component.editList };
    component.dropIntoEdit(dropEvent(target, target, target.data[0], 0, 1));
    expect(component.editList.map((item) => item.id)).toEqual(['b', 'a']);
  });

  it('accepts the legacy section palette marker and handles empty undo history', () => {
    const palette = inputFixture('', { title: 'SECTION', type: 'SectionComponent', data: null });
    component.dropIntoEdit(
      dropEvent(
        { id: 'sectionDropList', data: component.editList },
        { id: 'palette', data: [palette] },
        palette,
      ),
    );
    expect(component.editList[0].data).toEqual(
      jasmine.objectContaining({ sectionInputs: [], layout: LayoutEnum.VERTICAL }),
    );
    TestBed.inject(UndoRedoService).clearHistory();
    component.undoRedo(UndoRedoEnum.UNDO);
    expect(component.editList).toEqual([]);
    component.undoRedo(UndoRedoEnum.REDO);
    expect(component.editList).toEqual([]);
  });

  it('moves a question out of a section and clears its section-specific script', () => {
    const input = inputFixture('existing', { codeEditor: { enabled: true } });
    const source = { id: 'section', data: [input] };
    component.dropIntoEdit(
      dropEvent({ id: 'sectionDropList', data: component.editList }, source, input),
    );
    expect(source.data).toEqual([]);
    expect(component.editList).toEqual([{ id: 'existing', data: input }]);
    expect(input.data!.sectionId).toBe('sectionDropList');
    expect(input.codeEditor.enabled).toBeFalse();
  });

  it('adds new section questions without consuming the palette item', () => {
    const section = sectionFixture();
    component.editList = [{ id: section.sectionId, data: section }];
    const palette = inputFixture('');
    const source = { id: 'palette', data: [palette] };
    component.dropIntoSection(
      dropEvent({ id: section.sectionId, data: section.sectionInputs }, source, palette),
    );
    expect(section.sectionInputs).toHaveSize(1);
    expect(section.sectionInputs[0].data!.id).toBeTruthy();
    expect(section.sectionInputs[0].data!.sectionId).toBe(section.sectionId);
    expect(palette.data!.id).toBe('');
    expect(source.data).toEqual([palette]);
  });

  it('moves a top-level question into a section without nesting its wrapper', () => {
    const input = inputFixture('question');
    const section = sectionFixture();
    component.editList = [
      { id: 'question', data: input },
      { id: section.sectionId, data: section },
    ];
    component.dropIntoSection(
      dropEvent(
        { id: section.sectionId, data: section.sectionInputs },
        { id: 'sectionDropList', data: component.editList },
        component.editList[0],
      ),
    );
    expect(component.editList.map((item) => item.id)).toEqual([section.sectionId]);
    expect(section.sectionInputs[0].type).toBe('InputComponent');
    expect(section.sectionInputs[0].data!.id).toBe('question');
    expect(section.sectionInputs[0].data!.sectionId).toBe(section.sectionId);
  });

  it('moves and reorders questions between sections', () => {
    const first = sectionFixture('first', [inputFixture('a')]);
    const second = sectionFixture('second', [inputFixture('b')]);
    component.editList = [
      { id: 'first', data: first },
      { id: 'second', data: second },
    ];
    const destination = { id: 'second', data: second.sectionInputs };
    component.dropIntoSection(
      dropEvent(
        destination,
        { id: 'first', data: first.sectionInputs },
        first.sectionInputs[0],
        0,
        1,
      ),
    );
    expect(first.sectionInputs).toEqual([]);
    expect(second.sectionInputs.map((input) => input.data!.id)).toEqual(['b', 'a']);
    expect(second.sectionInputs[1].data!.sectionId).toBe('second');
    component.dropIntoSection(dropEvent(destination, destination, second.sectionInputs[1], 1, 0));
    expect(second.sectionInputs.map((input) => input.data!.id)).toEqual(['a', 'b']);
  });

  it('accepts question drops and rejects section drops inside a section', () => {
    const list = { data: [] } as unknown as CdkDropList<FormInputData[]>;
    for (const data of [inputFixture(), { id: 'wrapper', data: inputFixture() }]) {
      expect(component.sectionDropListEnterPredicate({ data } as CdkDrag, list)).toBeTrue();
    }
    expect(
      component.sectionDropListEnterPredicate({ data: sectionFixture() } as CdkDrag, list),
    ).toBeFalse();
  });

  it('starts a new undo history for a loaded project and repairs nested legacy wrappers', () => {
    const input = inputFixture('');
    const section = sectionFixture('section');
    const stored = projectFixture({
      editList: [
        {
          id: 'section',
          data: {
            ...section,
            sectionInputs: [{ id: 'legacy', data: input }],
          } as unknown as typeof section,
        },
      ],
    });
    spyOn(TestBed.inject(ProjectService), 'getProjectVersion').and.returnValue(stored);
    const clear = spyOn(TestBed.inject(UndoRedoService), 'clearHistory').and.callThrough();
    component.projectId = stored.id;
    component.ngOnInit();
    expect(clear).toHaveBeenCalled();
    expect(component.getAllFormInputs()[0].type).toBe('InputComponent');
    expect(component.getAllFormInputs()[0].data!.id).toBeTruthy();
    expect(input.data!.id).toBe('');
  });

  it('loads current project inputs on demand and safely ignores missing projects', () => {
    const search = spyOn(TestBed.inject(ProjectService), 'searchData').and.returnValue([]);
    const update = spyOn(TestBed.inject(ProjectService), 'update');
    component.projectId = 'missing';
    component.editList = [{ id: 'one', data: inputFixture() }];
    expect(component.getAllFormInputs()).toHaveSize(1);
    component.saveForm();
    expect(update).not.toHaveBeenCalled();
    const stored = projectFixture();
    search.and.returnValue([stored]);
    component.projectId = stored.id;
    component.saveForm();
    expect(update).toHaveBeenCalledWith(stored.id, stored);
  });

  it('validates saved questions, draft questions and repeated section settings', () => {
    expect(component.isFormInvalid()).toBeTrue();
    const input = inputFixture('a');
    const entry = { id: 'a', data: input };
    component.editList = [entry];
    const holder = jasmine.createSpyObj<InputHolderComponent>('holder', ['isValid']);
    component.inputComponents.reset([holder]);
    holder.isValid.and.returnValue(false);
    expect(component.isFormInvalid()).toBeTrue();
    holder.isValid.and.returnValue(true);
    expect(component.isFormInvalid()).toBeFalse();
    expect(component.isComponentInvalid(entry)).toBeFalse();
    expect(component.isComponentDraft(entry)).toBeFalse();
    input.data!.draft = true;
    expect(component.isComponentDraft(entry)).toBeTrue();
    const section = sectionFixture('section', [inputFixture('bad', { data: null })]);
    expect(component.isComponentInvalid({ id: 'section', data: section })).toBeTrue();
    expect(component.isComponentDraft({ id: 'section', data: section })).toBeFalse();
  });

  it('publishes name/value changes and resolves references to questions in preceding sections', () => {
    const nested = inputFixture('count', { customTitle: 'Count', type: 'CheckboxGroupComponent' });
    const repeated: RepeatedSectionList = {
      ...sectionFixture('repeat'),
      type: 'RepeatedSectionComponent',
      repeatByOther: true,
      repeatTimes: undefined,
      referencedInput: '',
      referencableInputs: [],
    };
    component.editList = [
      { id: 'ordinary', data: inputFixture() },
      { id: 'section', data: sectionFixture('section', [nested, inputFixture()]) },
      { id: 'repeat', data: repeated },
    ];
    component.updateName();
    expect(repeated.referencableInputs).toEqual(['Count']);
    expect(component.hasRepeatedSettingsErrorForEdit(component.editList[2])).toBeTrue();
    expect(component.getRepeatedSettingsSummary(repeated)).toBe(
      'COMPONENTS.SECTION.REPEATED.UNSPECIFIED',
    );
    repeated.referencedInput = 'Count';
    expect(component.getRepeatedSettingsSummary(repeated)).toBe('Count');
    const publish = spyOn(TestBed.inject(ComponentService).component$, 'next');
    component.onValueChanged({ id: 'count' });
    expect(publish).toHaveBeenCalledWith(component.editList);
  });

  it('closes the mobile settings drawer when resized to desktop', () => {
    const width = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(800);
    const repeated: RepeatedSectionList = {
      ...sectionFixture(),
      type: 'RepeatedSectionComponent',
      repeatByOther: false,
      repeatTimes: 2,
      referencedInput: undefined,
      referencableInputs: [],
    };
    component.onWindowResize();
    component.onRepeatedPopoverVisibleChange(false, repeated);
    expect(component.activeRepeatedSection).toBeNull();
    component.onRepeatedPopoverVisibleChange(true, repeated);
    expect(component.repeatedSettingsDrawerVisible).toBeTrue();
    width.and.returnValue(1400);
    component.onWindowResize();
    expect(component.repeatedSettingsDrawerVisible).toBeFalse();
    expect(component.activeRepeatedSection).toBeNull();
  });

  it('provides section controls, script hints and scroll navigation', () => {
    const section = sectionFixture('section', [
      inputFixture('child'),
      inputFixture('', { data: null }),
    ]);
    component.editList = [{ id: 'section', data: section }];
    const open = spyOn(TestBed.inject(ModalService), 'openSectionModal');
    component.sectionEdit(section);
    expect(open).toHaveBeenCalledWith(section);
    expect(component.getEditDropListConnectedTo()).toEqual(['section']);
    component.sectionLayoutChange(section);
    component.sectionLayoutChange(section);
    expect(section.layout).toBe(LayoutEnum.VERTICAL);
    expect(component.returnChildren(section)).toEqual([
      { title: 'Text', id: 'child' },
      { title: 'Text', id: '' },
    ]);
    expect(component.isLogicEnabled(null)).toBeFalse();
    expect(
      component.isLogicEnabled(inputFixture('logic', { codeEditor: { enabled: true } })),
    ).toBeTrue();
    expect(component.getConditionTooltip(null)).toBe('COMPONENTS.CODE_MIRROR');
    expect(
      component.getConditionTooltip(
        inputFixture('logic', {
          codeEditor: {
            enabled: true,
            data: { isValid: true, code: 'return true;', variables: [] },
          },
        }),
      ),
    ).toBe('return true;');
    const element = document.createElement('div');
    const scroll = spyOn(element, 'scrollIntoView');
    spyOn(document, 'getElementById').and.returnValue(element);
    component.scrollToElement('question');
    expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  });
});
