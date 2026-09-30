import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  computed,
  effect,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { SectionList } from '@app/pages/edit/interfaces/section-list';
import { CodeEditorMode, CodeEditorType, CodeEditorVariableType } from '@app/shared/enums/code-editor.enum';
import { CodeEditorData, CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import { FormInputData } from '@app/shared/interfaces/form-input-data';
import { ComponentService } from '@app/shared/services/component.service';
import { ModalService } from '@app/shared/services/modal.service';
import {NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef} from 'ng-zorro-antd/modal';
import { CodeEditorComponent } from '../code-editor.component';
import {TranslatePipe} from "@ngx-translate/core";
import {VariableIconPipe} from "@shared/pipes/variable-icon.pipe";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {FormsModule} from "@angular/forms";
import {NzTagComponent} from "ng-zorro-antd/tag";

@Component({
  selector: 'app-code-editor-modal',
  standalone: true,
  templateUrl: './code-editor-modal.component.html',
  styleUrl: './code-editor-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    VariableIconPipe,
    NzDividerModule,
    NzIconModule,
    NzTooltipDirective,
    FormsModule,
    NzTagComponent,
    CodeEditorComponent,
    NzModalFooterDirective,

  ]
})
export class CodeEditorModalComponent {
  readonly elementId = input<string>();

  private readonly codeEditorElement = viewChild(CodeEditorComponent);

  readonly selectedElement = signal<SectionList | FormInputData | undefined>(undefined);
  readonly selectedElementCodeMirror = signal<CodeEditorData>({
    enabled: false,
  });
  readonly variableList = signal<CodeEditorVariable[]>([]);
  readonly isModal: boolean;

  private readonly targetElementId = computed(() => this.data?.elementId || this.elementId());

  CodeEditorMode = CodeEditorMode;
  CodeEditorType = CodeEditorType;
  CodeEditorVariableType = CodeEditorVariableType;

  constructor(
    private componentService: ComponentService,
    private nzModalRef: NzModalRef,
    private modalService: ModalService,
    @Inject(NZ_MODAL_DATA) public readonly data: { elementId: string }
  ) {
    this.isModal = !!this.data?.elementId;

    effect(() => {
      const elementId = this.targetElementId();
      untracked(() => this.getSelectedElement(elementId));
    });
  }

  closeModal(): void {
    this.nzModalRef.close();
  }

  saveModal(): void {
    const selectedElement = this.selectedElement();
    if (selectedElement) {
      selectedElement.codeEditor = this.selectedElementCodeMirror();
      this.closeModal();
    }
  }

  onEnabledChange(event: boolean): void {
    this.selectedElementCodeMirror.update((codeMirror) => ({
      ...codeMirror,
      enabled: event,
      data:
        event && !codeMirror.data
          ? {
              code: '',
              isValid: false,
              variables: [],
            }
          : codeMirror.data,
    }));
  }

  updateCodeEditor(event: { code?: string; isValid: boolean }): void {
    this.updateCodeMirrorData((data) => ({
      ...data,
      isValid: event.isValid,
      code: event.code ? event.code : data.code,
    }));
  }

  openVariableModal(): void {
    const codeMirrorData = this.selectedElementCodeMirror().data;
    const modal = this.modalService.openVariableModal(
      codeMirrorData && codeMirrorData.variables ? codeMirrorData.variables : [],
      this.variableList()
    );

    modal.afterClose.subscribe((variables?: CodeEditorVariable[]) => {
      if (variables) {
        this.updateCodeMirrorData((data) => ({
          ...data,
          variables: [...variables].sort((a, b) => a.title.localeCompare(b.title)),
        }));
      }
    });
  }

  insertVariable(index: number) {
    const codeEditor = this.codeEditorElement();
    const codeMirrorData = this.selectedElementCodeMirror().data;
    if (codeEditor && codeMirrorData) {
      codeEditor.insertVariable(codeMirrorData.variables[index]);
    }
  }

  removeVariable(event: MouseEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();

    // The code editor reloads its linter when it receives the new variable list
    this.updateCodeMirrorData((data) => ({
      ...data,
      variables: data.variables.filter((_, variableIndex) => variableIndex !== index),
    }));
  }

  private updateCodeMirrorData(
    updater: (data: NonNullable<CodeEditorData['data']>) => NonNullable<CodeEditorData['data']>,
  ): void {
    this.selectedElementCodeMirror.update((codeMirror) =>
      codeMirror.data ? { ...codeMirror, data: updater(codeMirror.data) } : codeMirror,
    );
  }

  private getSelectedElement(elementId: string | undefined) {
    if (elementId && elementId !== '') {
      const selectedElement = this.componentService.getItemById(elementId);
      this.selectedElement.set(selectedElement);
      if (selectedElement) {
        this.selectedElementCodeMirror.set(
          selectedElement.codeEditor
            ? structuredClone(selectedElement.codeEditor)
            : { enabled: false },
        );
      }

      this.variableList.set(this.componentService.getVariableList(elementId));
    }
  }
}