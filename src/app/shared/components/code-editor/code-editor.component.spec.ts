import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { CodeEditorComponent } from './code-editor.component';
import {
  CodeEditorMode,
  CodeEditorType,
  CodeEditorVariableType,
} from '@app/shared/enums/code-editor.enum';
import { JavaScriptLinterService } from '@services/javascript-linter.service';
import { EditorView } from '@codemirror/view';
import { forceLinting, forEachDiagnostic } from '@codemirror/lint';
import type { Diagnostic } from '@codemirror/lint';
import { EventService } from '@services/event.service';
import { ThemeEnum } from '@app/shared/enums/theme.enum';
import { firstValueFrom, filter } from 'rxjs';

describe('CodeEditorComponent', () => {
  let fixture: ComponentFixture<CodeEditorComponent>;
  let component: CodeEditorComponent;
  let lint: jasmine.Spy;
  let terminate: jasmine.Spy;
  let postMessage: jasmine.Spy;
  let worker: {
    onmessage: ((event: MessageEvent) => void) | null;
    terminate: jasmine.Spy;
    postMessage: jasmine.Spy;
  };

  beforeEach(() => {
    lint = jasmine.createSpy('lint').and.resolveTo([]);
    terminate = jasmine.createSpy('terminate');
    postMessage = jasmine.createSpy('postMessage').and.callFake(() => {
      queueMicrotask(() =>
        worker.onmessage?.(new MessageEvent('message', { data: { success: true, result: true } })),
      );
    });
    worker = { onmessage: null, terminate, postMessage };
    spyOn(window, 'Worker').and.returnValue(worker as unknown as Worker);
    TestBed.configureTestingModule({
      imports: [CodeEditorComponent],
      providers: [...appConfig.providers, { provide: JavaScriptLinterService, useValue: { lint } }],
    });
    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;
  });

  function editor(): EditorView {
    return EditorView.findFromDOM(fixture.nativeElement.querySelector('.cm-editor'))!;
  }

  it('renders JSON in read-only mode by default and destroys its worker', () => {
    fixture.componentRef.setInput('code', '{"answer":42}');
    fixture.detectChanges();
    expect(editor().state.doc.toString()).toBe('{"answer":42}');
    expect(editor().state.readOnly).toBeTrue();
    fixture.destroy();
    expect(terminate).toHaveBeenCalledTimes(1);
  });

  it('inserts variables at the cursor and moves the selection after them', () => {
    fixture.componentRef.setInput('mode', CodeEditorMode.EDIT);
    fixture.detectChanges();
    component.insertVariable({
      elementId: 'first',
      title: 'answer',
      type: CodeEditorVariableType.NUMBER,
    });
    expect(editor().state.doc.toString()).toBe('answer ');
    expect(editor().state.selection.main.head).toBe(7);
    expect(editor().state.readOnly).toBeFalse();
  });

  it('validates JavaScript before sending it to the worker and emits boolean results', async () => {
    fixture.componentRef.setInput('mode', CodeEditorMode.EDIT);
    fixture.componentRef.setInput('type', CodeEditorType.JAVA_SCRIPT);
    fixture.componentRef.setInput('code', 'return true;');
    const result = firstValueFrom(
      component.updateCodeEditor.pipe(filter((event) => event.isValid)),
    );
    fixture.detectChanges();
    forceLinting(editor());
    expect(await result).toEqual({ code: 'return true;', isValid: true });
    expect(lint).toHaveBeenCalledWith('\nreturn true;', component.jsHintConfig);
    expect(postMessage).toHaveBeenCalledWith({ code: '\nreturn true;' });
  });

  it('emits invalid status and does not execute code if loading the linter fails', async () => {
    lint.and.rejectWith(new Error('load failed'));
    fixture.componentRef.setInput('type', CodeEditorType.JAVA_SCRIPT);
    fixture.componentRef.setInput('code', 'return true;');
    const invalid = firstValueFrom(component.updateCodeEditor);
    fixture.detectChanges();
    forceLinting(editor());
    expect(await invalid).toEqual({ isValid: false });
    expect(component.currentErrorsLength()).toBe(1);
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('regenerates typed variable declarations and invalidates the previous result', () => {
    fixture.detectChanges();
    const updated = spyOn(component.updateCodeEditor, 'emit');
    fixture.componentRef.setInput('variables', [
      { elementId: 'one', title: 'count', type: CodeEditorVariableType.NUMBER },
      { elementId: 'two', title: 'names', type: CodeEditorVariableType.STRING_ARRAY },
    ]);
    fixture.detectChanges();
    expect(component.generatedVariable).toBe('const count = 11;const names = [];\n');
    expect(updated).toHaveBeenCalledWith({ isValid: false });
  });

  function javascriptEditor(code = 'return true;') {
    fixture.componentRef.setInput('mode', CodeEditorMode.EDIT);
    fixture.componentRef.setInput('type', CodeEditorType.JAVA_SCRIPT);
    fixture.componentRef.setInput('code', code);
    fixture.detectChanges();
  }

  async function waitForLintResultsToReachCodeMirror(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  }

  async function flushLint() {
    forceLinting(editor());
    await waitForLintResultsToReachCodeMirror();
  }

  it('maps errors, warnings and hints to editor positions without executing invalid code', async () => {
    lint.and.resolveTo([
      { code: 'E001', line: 2, reason: 'Invalid expression' },
      { code: 'W033', line: 3, reason: 'Missing semicolon' },
      { code: 'I001', line: 999, reason: 'Hint' },
    ]);
    javascriptEditor('  invalid  \nreturn true\nnext');
    await flushLint();
    expect(component.currentErrorsLength()).toBe(1);
    expect(component.currentWarningsLength()).toBe(1);
    expect(postMessage).not.toHaveBeenCalled();
    const diagnostics: Diagnostic[] = [];
    forEachDiagnostic(editor().state, (diagnostic) => diagnostics.push(diagnostic));
    expect(diagnostics).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          from: 2,
          to: 9,
          severity: 'error',
          message: 'Invalid expression',
        }),
        jasmine.objectContaining({
          from: 23,
          to: 23,
          severity: 'warning',
          message: 'Missing semicolon',
        }),
        jasmine.objectContaining({ severity: 'hint', message: 'Hint' }),
      ]),
    );
  });

  it('tracks document edits and cursor movement', () => {
    javascriptEditor();
    editor().dispatch({
      changes: { from: 0, to: 12, insert: 'return false;' },
      selection: { anchor: 4 },
    });
    expect(component.editing).toBeTrue();
    expect(component.lastCursorPosition).toBe(4);
    editor().dispatch({ changes: { from: 13, insert: ' ' } });
    expect(component.editing).toBeTrue();
  });

  it('tracks focus and evaluates the validated document again on blur', async () => {
    javascriptEditor();
    await flushLint();
    postMessage.calls.reset();
    editor().focus();
    editor().dispatch({});
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(component.focused).toBeTrue();
    editor().contentDOM.blur();
    editor().dispatch({});
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(component.focused).toBeFalse();
    expect(postMessage).toHaveBeenCalledWith({ code: '\nreturn true;' });
  });

  for (const [result, error] of [
    [{ success: false, error: 'Runtime error' }, 'RUN_CODE'],
    [{ success: true, result: 42 }, 'RETURN'],
  ] as const) {
    it(`rejects worker results that require ${error} feedback`, async () => {
      spyOn(console, 'error');
      postMessage.and.callFake(() =>
        worker.onmessage?.(new MessageEvent('message', { data: result })),
      );
      javascriptEditor();
      const emit = spyOn(component.updateCodeEditor, 'emit');
      await flushLint();
      expect(component.errorCodeEditor()).toBe(error);
      expect(emit).not.toHaveBeenCalledWith(jasmine.objectContaining({ isValid: true }));
    });
  }

  it('terminates code execution that exceeds the time limit', async () => {
    javascriptEditor();
    jasmine.clock().install();
    try {
      postMessage.and.stub();
      await flushLint();
      expect(postMessage).toHaveBeenCalled();
      jasmine.clock().tick(10_000);
      expect(terminate).toHaveBeenCalled();
      expect(component.errorCodeEditor()).toBe('RUN_CODE');
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('reports a worker posting failure', async () => {
    javascriptEditor();
    jasmine.clock().install();
    try {
      spyOn(console, 'error');
      postMessage.and.throwError('Worker unavailable');
      await flushLint();
      expect(component.errorCodeEditor()).toBe('RUN_CODE');
      jasmine.clock().tick(10_000);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  for (const reject of [false, true]) {
    it(`ignores a stale lint ${reject ? 'failure' : 'result'} after the document changes`, async () => {
      let resolve!: (result: unknown[]) => void;
      let fail!: (reason: Error) => void;
      lint.and.returnValue(
        new Promise((res, rej) => {
          resolve = res;
          fail = rej;
        }),
      );
      javascriptEditor();
      forceLinting(editor());
      editor().dispatch({ changes: { from: 0, to: 12, insert: 'return false;' } });
      if (reject) fail(new Error('Old lint failed'));
      else resolve([{ code: 'E001', line: 2, reason: 'Old error' }]);
      await Promise.resolve();
      await Promise.resolve();
      expect(component.currentErrorsLength()).toBe(0);
      expect(postMessage).not.toHaveBeenCalled();
    });
  }

  it('ignores an in-flight lint result after destruction', async () => {
    let resolve!: (result: unknown[]) => void;
    lint.and.returnValue(
      new Promise((res) => {
        resolve = res;
      }),
    );
    javascriptEditor();
    forceLinting(editor());
    fixture.destroy();
    resolve([]);
    await Promise.resolve();
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('does not run an empty JavaScript document', async () => {
    javascriptEditor('');
    await flushLint();
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('generates example values for every supported variable type', () => {
    fixture.componentRef.setInput('variables', [
      { elementId: 'b', title: 'flag', type: CodeEditorVariableType.BOOLEAN },
      { elementId: 's', title: 'text', type: CodeEditorVariableType.STRING },
      { elementId: 'd', title: 'date', type: CodeEditorVariableType.DATE },
      { elementId: 'a', title: 'dates', type: CodeEditorVariableType.DATE_ARRAY },
    ]);
    fixture.detectChanges();
    expect(component.generatedVariable).toBe(
      'const flag = true;const text = "";const date = new Date();const dates = [];\n',
    );
  });

  it('updates the editor theme while preserving its document', () => {
    TestBed.inject(EventService).themeChange.next(ThemeEnum.DARK);
    fixture.componentRef.setInput('code', '{"saved":true}');
    fixture.detectChanges();
    const darkClasses = editor().dom.className;
    TestBed.inject(EventService).themeChange.next(ThemeEnum.LIGHT);
    fixture.detectChanges();
    expect(editor().dom.className).not.toBe(darkClasses);
    expect(editor().state.doc.toString()).toBe('{"saved":true}');
  });
});
