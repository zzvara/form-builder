import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { EditComponent } from '@pages/edit/edit.component';
import { inputFixture, mockStorage, projectFixture, sectionFixture } from '@app/testing/fixtures';
import type { EditList } from './interfaces/edit-list';
import { UndoRedoEnum } from '@interfaces/undo-redo-type.enum';
import { ComponentService } from '@services/component.service';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let store: FormBuilderStore;

  beforeEach(() => {
    mockStorage();
    TestBed.configureTestingModule({
      imports: [EditComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(FormBuilderStore);
    fixture.componentRef.setInput('inlineEdit', { enabled: true });
    fixture.detectChanges();
  });

  it('starts with no components when the store has no project', () => {
    expect(component.editList()).toEqual([]);
    expect(component.names()).toEqual([]);
  });

  it('reactively mirrors the current project edit list', () => {
    const editList: EditList[] = [
      { id: 'input', data: inputFixture('input', { customTitle: 'Question' }) },
      { id: 'section', data: sectionFixture('section') },
    ];

    store.project.set(projectFixture({ editList }));
    fixture.detectChanges();

    expect(component.editList()).toEqual(editList);
    expect(component.names()).toEqual(['Question']);
    expect(TestBed.inject(ComponentService).component$.value).toEqual(editList);
  });

  it('pushes editor removals back into the project store', () => {
    const editList: EditList[] = [{ id: 'input', data: inputFixture('input') }];
    store.project.set(projectFixture({ editList }));
    fixture.detectChanges();

    component.removeEditComponent(component.editList()[0]);

    expect(component.editList()).toEqual([]);
    expect(store.project()?.editList).toEqual([]);
  });

  it('clears editor state when the active project has no components', () => {
    store.project.set(projectFixture({ editList: [{ id: 'input', data: inputFixture('input') }] }));
    fixture.detectChanges();
    store.project.set(projectFixture({ editList: [] }));
    fixture.detectChanges();

    expect(component.editList()).toEqual([]);
    expect(component.getAllFormInputs()).toEqual([]);
  });

  it('forwards undo and redo actions to the shared store', () => {
    const undo = spyOn(store, 'undoEdit');
    const redo = spyOn(store, 'redoEdit');

    component.undoRedo(UndoRedoEnum.UNDO);
    component.undoRedo(UndoRedoEnum.REDO);

    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).toHaveBeenCalledTimes(1);
  });
});
