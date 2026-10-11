import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { appConfig } from '@app/app.config';
import { inputFixture } from '@app/testing/fixtures';
import { ComponentService } from '@services/component.service';
import { ModalService } from '@services/modal.service';
import { CodeEditorModalComponent } from './code-editor-modal.component';
import type { CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import { CodeEditorVariableType as T } from '@app/shared/enums/code-editor.enum';
import type { CodeEditorComponent } from '../code-editor.component';

describe('CodeEditorModalComponent', () => {
  let fixture: ComponentFixture<CodeEditorModalComponent>;
  let component: CodeEditorModalComponent;
  let close: jasmine.Spy;
  let variableResult: Subject<CodeEditorVariable[] | undefined>;

  let selected: ReturnType<typeof inputFixture>;
  beforeEach(() => {
    close = jasmine.createSpy('close');
    variableResult = new Subject();
    selected = inputFixture('target');
    TestBed.configureTestingModule({
      imports: [CodeEditorModalComponent],
      providers: [
        ...appConfig.providers,
        { provide: NZ_MODAL_DATA, useValue: { elementId: 'target' } },
        {
          provide: NzModalRef,
          useValue: { close, updateConfig: jasmine.createSpy('updateConfig') },
        },
        {
          provide: ModalService,
          useValue: { openVariableModal: () => ({ afterClose: variableResult }) },
        },
      ],
    });
    TestBed.inject(ComponentService).component$.next([{ id: 'target', data: selected }]);
    fixture = TestBed.createComponent(CodeEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('edits a copy of the selected element until save', () => {
    expect(component.isModal).toBeTrue();
    component.onEnabledChange(true);
    component.updateCodeEditor({ code: 'return true;', isValid: true });
    expect(selected.codeEditor.enabled).toBeFalse();
    component.saveModal();
    expect(selected.codeEditor).toEqual({
      enabled: true,
      data: { code: 'return true;', isValid: true, variables: [] },
    });
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('inserts selected variables and reloads validation after removing one', () => {
    const editor = jasmine.createSpyObj<CodeEditorComponent>('editor', [
      'insertVariable',
      'reloadJsHint',
    ]);
    component.codeEditorElement = editor;
    component.onEnabledChange(true);
    const variable = { elementId: 'a', title: 'answer', type: T.NUMBER };
    component.selectedElementCodeMirror.data!.variables = [variable];
    component.insertVariable(0);
    expect(editor.insertVariable).toHaveBeenCalledWith(variable);
    component.removeVariable(new MouseEvent('click'), 0);
    expect(editor.reloadJsHint).toHaveBeenCalledTimes(1);
    expect(component.selectedElementCodeMirror.data!.variables).toEqual([]);
  });

  it('loads a changed target and safely handles a missing selection', () => {
    const other = inputFixture('other');
    other.codeEditor = undefined!;
    TestBed.inject(ComponentService).component$.next([{ id: 'other', data: other }]);
    fixture.componentRef.setInput('elementId', 'other');
    fixture.detectChanges();
    expect(component.selectedElement).toBe(other);
    expect(component.selectedElementCodeMirror).toEqual({ enabled: false });
    fixture.componentRef.setInput('elementId', 'missing');
    fixture.detectChanges();
    component.saveModal();
    expect(close).not.toHaveBeenCalled();
    component.updateCodeEditor({ isValid: false });
    component.insertVariable(0);
    component.openVariableModal();
    variableResult.next(undefined);
    expect(component.selectedElementCodeMirror).toEqual({ enabled: false });
    component.removeVariable(new MouseEvent('click'), 0);
  });

  it('discards changes when cancelled', () => {
    component.onEnabledChange(true);
    component.closeModal();
    expect(selected.codeEditor).toEqual({ enabled: false });
    expect(close).toHaveBeenCalledOnceWith();
  });
  
  it('sorts selected variables and removes the requested variable', () => {
    component.onEnabledChange(true);
    component.openVariableModal();
    variableResult.next([
      { elementId: 'z', title: 'zebra', type: T.STRING },
      { elementId: 'a', title: 'alpha', type: T.NUMBER },
    ]);
    expect(component.selectedElementCodeMirror.data!.variables.map((v) => v.title)).toEqual([
      'alpha',
      'zebra',
    ]);
    const event = new MouseEvent('click', { cancelable: true });
    component.removeVariable(event, 0);
    expect(event.defaultPrevented).toBeTrue();
    expect(component.selectedElementCodeMirror.data!.variables.map((v) => v.title)).toEqual([
      'zebra',
    ]);
  });
});
