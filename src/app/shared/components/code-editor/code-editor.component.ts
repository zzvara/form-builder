import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CodeEditorMode, CodeEditorType } from '@app/shared/enums/code-editor.enum';
import { ThemeEnum } from '@app/shared/enums/theme.enum';
import { EventService } from '@app/shared/services/event.service';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import { basicDark } from '@fsegurai/codemirror-theme-basic-dark';
import { basicLight } from '@fsegurai/codemirror-theme-basic-light';
import { basicSetup, EditorView } from 'codemirror';

@Component({
  selector: 'app-code-editor',
  standalone: false,
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css',
})
export class CodeEditorComponent implements OnInit, AfterViewInit {
  @Input() mode = CodeEditorMode.VIEW;
  @Input() type = CodeEditorType.JSON;
  @Input() code = '';

  @ViewChild('editor', { static: true }) editorElement?: ElementRef;

  private editorView?: EditorView;
  private editorTheme = new Compartment();
  private editorExtensions: Extension[] = [
    basicSetup,
    EditorView.lineWrapping,
    lintGutter(),
    this.editorTheme.of(this.eventService.themeChange.value === ThemeEnum.LIGHT ? basicLight : basicDark),
  ];

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    if (this.type === CodeEditorType.JSON) {
      this.editorExtensions.push(json(), linter(jsonParseLinter()));
    }
    if (this.mode === CodeEditorMode.VIEW) {
      this.editorExtensions.push(EditorState.readOnly.of(true));
    }

    this.editorChangeTheme();
    this.eventService.themeChange.subscribe(() => {
      this.editorChangeTheme();
    });
  }

  ngAfterViewInit(): void {
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
}
