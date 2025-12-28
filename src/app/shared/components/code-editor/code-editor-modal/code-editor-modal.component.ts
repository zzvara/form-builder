import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SectionList } from '@app/pages/edit/interfaces/section-list';
import { CodeEditorMode, CodeEditorType, CodeEditorVariableType } from '@app/shared/enums/code-editor.enum';
import { CodeEditorData, CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import { FormInputData } from '@app/shared/interfaces/form-input-data';
import { ComponentService } from '@app/shared/services/component.service';
import { ModalService } from '@app/shared/services/modal.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CodeEditorComponent } from '../code-editor.component';

@Component({
  selector: 'app-code-editor-modal',
  standalone: false,
  templateUrl: './code-editor-modal.component.html',
  styleUrl: './code-editor-modal.component.css',
})
export class CodeEditorModalComponent implements OnInit, OnChanges {
  @Input() elementId?: string;

  @ViewChild(CodeEditorComponent) codeEditorElement?: CodeEditorComponent;

  selectedElement?: SectionList | FormInputData;
  selectedElementCodeMirror: CodeEditorData = {
    enabled: false,
  };
  variableList: CodeEditorVariable[] = [];
  isModal = false;

  CodeEditorMode = CodeEditorMode;
  CodeEditorType = CodeEditorType;
  CodeEditorVariableType = CodeEditorVariableType;

  constructor(
    private componentService: ComponentService,
    private nzModalRef: NzModalRef,
    private modalService: ModalService,
    @Inject(NZ_MODAL_DATA) public readonly data: { elementId: string }
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.elementId) {
      this.elementId = this.data.elementId;
      this.isModal = true;
    }

    this.getSelectedElement();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementId'] && changes['elementId'].currentValue !== changes['elementId'].previousValue) {
      this.getSelectedElement();
    }
  }

  closeModal(): void {
    this.nzModalRef.close();
  }

  saveModal(): void {
    if (this.selectedElement) {
      this.selectedElement.codeEditor = this.selectedElementCodeMirror;
      this.closeModal();
    }
  }

  onEnabledChange(event: boolean): void {
    this.selectedElementCodeMirror.enabled = event;
    if (event && !this.selectedElementCodeMirror.data) {
      this.selectedElementCodeMirror.data = {
        code: '',
        isValid: false,
        variables: [],
      };
    }
  }

  updateCodeEditor(event: { code?: string; isValid: boolean }): void {
    if (this.selectedElementCodeMirror.data) {
      this.selectedElementCodeMirror.data.isValid = event.isValid;
      if (event.code) {
        this.selectedElementCodeMirror.data.code = event.code;
      }
    }
  }

  openVariableModal(): void {
    const modal = this.modalService.openVariableModal(
      this.selectedElementCodeMirror.data && this.selectedElementCodeMirror.data.variables
        ? this.selectedElementCodeMirror.data.variables
        : [],
      this.variableList
    );

    modal.afterClose.subscribe((variables?: CodeEditorVariable[]) => {
      if (variables && this.selectedElementCodeMirror.data) {
        this.selectedElementCodeMirror.data.variables = variables.sort((a, b) => a.title.localeCompare(b.title));
      }
    });
  }

  insertVariable(index: number) {
    if (this.codeEditorElement && this.selectedElementCodeMirror.data) {
      this.codeEditorElement.insertVariable(this.selectedElementCodeMirror.data.variables[index]);
    }
  }

  removeVariable(event: MouseEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.selectedElementCodeMirror.data) {
      this.selectedElementCodeMirror.data.variables.splice(index, 1);
    }

    if (this.codeEditorElement && this.selectedElementCodeMirror.data) {
      this.codeEditorElement.reloadJsHint();
    }
  }

  private getSelectedElement() {
    if (this.elementId && this.elementId !== '') {
      this.selectedElement = this.componentService.getItemById(this.elementId);
      if (this.selectedElement) {
        this.selectedElementCodeMirror = structuredClone(this.selectedElement.codeEditor);
      }

      this.variableList = this.componentService.getVariableList(this.elementId);
    }
  }
}
