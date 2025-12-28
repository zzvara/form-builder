import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CodeEditorMode, CodeEditorType, CodeEditorVariableType } from '@app/shared/enums/code-editor.enum';
import { ThemeEnum } from '@app/shared/enums/theme.enum';
import { CodeEditorError, CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import { EventService } from '@app/shared/services/event.service';
import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { Diagnostic, diagnosticCount, linter, lintGutter, lintKeymap } from '@codemirror/lint';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import { keymap, ViewUpdate } from '@codemirror/view';
import { basicDark } from '@fsegurai/codemirror-theme-basic-dark';
import { basicLight } from '@fsegurai/codemirror-theme-basic-light';
import { basicSetup, EditorView } from 'codemirror';
import { JSHINT } from 'jshint';

@Component({
  selector: 'app-code-editor',
  standalone: false,
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css',
})
export class CodeEditorComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() mode = CodeEditorMode.VIEW;
  @Input() type = CodeEditorType.JSON;
  @Input() code = '';
  @Input() variables: CodeEditorVariable[] = [];

  @Output() updateCodeEditor: EventEmitter<{ code?: string; isValid: boolean }> = new EventEmitter();

  @ViewChild('editor', { static: true }) editorElement?: ElementRef;

  initEditor = true;
  editing = false;
  focused = false;
  lastCursorPosition = 0;

  generatedVariable = '';
  currentErrorsLength = 0;
  currentWarningsLength = 0;
  errorCodeEditor?: string;

  // JsHint Config: https://jshint.com/docs/options/
  jsHintConfig = {
    varstmt: true, // let, const
    esnext: true,
  };

  private codeWorker?: Worker;
  private editorView!: EditorView;
  private editorTheme = new Compartment();
  private editorExtensions: Extension[] = [
    basicSetup,
    EditorView.lineWrapping,
    lintGutter(),
    this.editorTheme.of(this.eventService.themeChange.value === ThemeEnum.LIGHT ? basicLight : basicDark),
  ];

  CodeEditorMode = CodeEditorMode;

  constructor(private readonly eventService: EventService) {
    if (typeof Worker !== 'undefined') {
      this.codeWorker = new Worker(new URL('./../../workers/code-runner.worker', import.meta.url), { type: 'module' });
    }
  }

  ngOnInit(): void {
    if (this.type === CodeEditorType.JSON) {
      this.editorExtensions.push(json(), linter(jsonParseLinter()));
    } else if (this.type === CodeEditorType.JAVA_SCRIPT) {
      this.editorExtensions.push(
        keymap.of([...defaultKeymap, ...lintKeymap]),
        javascript(),
        linter(this.jsLinter.bind(this)),
        this.createUpdateListener()
      );
    }
    if (this.mode === CodeEditorMode.VIEW) {
      this.editorExtensions.push(EditorState.readOnly.of(true));
    }

    this.editorChangeTheme();
    this.eventService.themeChange.subscribe(() => {
      this.editorChangeTheme();
    });
  }

  ngOnDestroy(): void {
    if (this.codeWorker) {
      this.codeWorker.terminate();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variables'] && JSON.stringify(changes['variables'].previousValue) !== JSON.stringify(changes['variables'].currentValue)) {
      this.generatedVariable = this.generateVariable();
      this.reloadJsHint();
    }
  }

  ngAfterViewInit(): void {
    this.generatedVariable = this.generateVariable();
    this.editorInit();
  }

  editorDestroy(): void {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  editorInit(): void {
    if (this.editorElement) {
      this.editorDestroy();

      this.editorView = new EditorView({
        state: EditorState.create({
          doc: `${this.code}`,
          extensions: this.editorExtensions,
        }),
        parent: this.editorElement?.nativeElement,
      });

      this.editorChangeTheme();
    }
  }

  editorChangeTheme(): void {
    if (this.editorView) {
      this.editorView.dispatch({
        effects: this.editorTheme.reconfigure(this.eventService.themeChange.value === ThemeEnum.LIGHT ? basicLight : basicDark),
      });
    }
  }

  insertVariable(variable: CodeEditorVariable): void {
    if (this.editorView) {
      const cursorPosition = this.editorView.state.selection.main.head;
      this.editorView.dispatch({
        changes: {
          from: cursorPosition,
          to: cursorPosition,
          insert: variable.title + ' ',
        },
        selection: {
          anchor: cursorPosition + variable.title.length + 1,
          head: cursorPosition + variable.title.length + 1,
        },
      });
      this.editorView.focus();
    }
  }

  reloadJsHint(): void {
    this.updateCodeEditor.emit({ isValid: false });
    if (this.editorView) {
      const newState = EditorState.create({
        doc: this.editorView.state.doc.toString(),
        extensions: this.editorExtensions,
      });
      this.editorView.setState(newState);
    }
  }

  private createUpdateListener(): Extension {
    return EditorView.updateListener.of((update: ViewUpdate) => {
      // Document
      if (update.docChanged) {
        if (!this.editing) {
          this.editing = true;
        }
      }

      // Focus
      if (update.focusChanged) {
        this.focused = update.view.hasFocus;

        if (!update.view.hasFocus) {
          if (diagnosticCount(this.editorView.state) === 0) {
            this.evaluateCode(this.editorView.state);
          }
        }
      }

      // Cursor
      if (update.selectionSet) {
        this.lastCursorPosition = update.state.selection.main.head;
      }
    });
  }

  private evaluateCode(editorState: EditorState) {
    this.errorCodeEditor = undefined;

    if (this.currentErrorsLength !== 0) {
      return;
    }

    const doc = editorState.doc.toString();
    if (!doc || !this.codeWorker) {
      return;
    }

    const fullCode = `${this.generatedVariable}${doc}`;

    try {
      const timeout = setTimeout(() => {
        this.codeWorker?.terminate();
        this.errorCodeEditor = 'RUN_CODE';
      }, 10_000);

      this.codeWorker.onmessage = (message: MessageEvent) => {
        clearTimeout(timeout);

        const data = message.data as { error?: string; success: boolean; result?: any };
        if (!data.success) {
          console.error('Worker error:', data.error);
          this.errorCodeEditor = 'RUN_CODE';
          return;
        }

        const result = data.result;

        if (typeof result === 'boolean') {
          this.updateCodeEditor.emit({
            code: doc,
            isValid: true,
          });
        } else {
          this.errorCodeEditor = 'RETURN';
        }
      };

      this.codeWorker.postMessage({ code: fullCode });
    } catch (error) {
      console.error('Error', error);
      this.errorCodeEditor = 'RUN_CODE';
    }
  }

  private jsLinter(view: EditorView): Diagnostic[] {
    this.editing = false;
    this.errorCodeEditor = undefined;

    const doc = view.state.doc.toString();
    const code = `${this.generatedVariable}${doc}`;

    JSHINT(code, this.jsHintConfig);

    const errors: CodeEditorError[] = JSHINT.errors.map((error) => {
      let pos = { from: 0, to: 0 };
      const line = view.state.doc.line(error.line - 1);
      const spaces = this.countLeadingAndTrailingSpaces(line.text);
      if (error.code === 'W033') {
        pos.from = line.to;
        pos.to = line.to;
      } else {
        pos.from = line.from + spaces.leading;
        pos.to = line.from + line.text.length - spaces.trailing;
      }

      return { from: pos.from, to: pos.to, code: error.code, a: error.a, b: error.b, c: error.c, d: error.d, reason: error.reason };
    });

    this.currentErrorsLength = errors.filter((error) => error.code.indexOf('E') >= 0).length;
    this.currentWarningsLength = errors.filter((error) => error.code.indexOf('W') >= 0).length;

    if (errors.length === 0) {
      this.evaluateCode(view.state);
    }

    return errors.map(
      (error) =>
        ({
          from: error.from,
          to: error.to,
          severity: error.code.indexOf('W') >= 0 ? 'warning' : error.code.indexOf('E') >= 0 ? 'error' : 'hint',
          message: error.reason,
        }) as Diagnostic
    );
  }

  private countLeadingAndTrailingSpaces(text: string): {
    leading: number;
    trailing: number;
  } {
    let leading = 0;
    let trailing = 0;

    // eleje
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        leading++;
      } else {
        break;
      }
    }

    // vége
    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] === ' ') {
        trailing++;
      } else {
        break;
      }
    }

    return { leading, trailing };
  }

  private generateVariable(): string {
    let result = '';
    this.variables.forEach((variable) => {
      switch (variable.type) {
        case CodeEditorVariableType.NUMBER:
          result += `const ${variable.title} = 11;`;
          break;
        case CodeEditorVariableType.BOOLEAN:
          result += `const ${variable.title} = true;`;
          break;
        case CodeEditorVariableType.STRING:
          result += `const ${variable.title} = "";`;
          break;
        case CodeEditorVariableType.DATE:
          result += `const ${variable.title} = new Date();`;
          break;
        case CodeEditorVariableType.DATE_ARRAY:
        case CodeEditorVariableType.STRING_ARRAY:
          result += `const ${variable.title} = [];`;
          break;
      }
    });
    return result + '\n';
  }
}
