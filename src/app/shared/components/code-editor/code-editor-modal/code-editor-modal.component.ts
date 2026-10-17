import type {
  OnChanges,
  OnInit,
  SimpleChanges} from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import type { SectionList } from '@app/pages/edit/interfaces/section-list';
import {
  CodeEditorMode,
  CodeEditorType,
  CodeEditorVariableType,
} from '@app/shared/enums/code-editor.enum';
import type { CodeEditorData, CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import type { FormInputData } from '@app/shared/interfaces/form-input-data';
import { ComponentService } from '@app/shared/services/component.service';
import { ModalService } from '@app/shared/services/modal.service';
import { NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef } from 'ng-zorro-antd/modal';
import { CodeEditorComponent } from '../code-editor.component';
import { TranslatePipe } from '@ngx-translate/core';
import { VariableIconPipe } from '@shared/pipes/variable-icon.pipe';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { FormsModule } from '@angular/forms';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-code-editor-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './code-editor-modal.component.html',
  styleUrl: './code-editor-modal.component.css',
  imports: [
    TranslatePipe,
    VariableIconPipe,
    NzDividerModule,
    NzIconModule,
    NzTooltipDirective,
    FormsModule,
    NzTagComponent,
    NzCheckboxComponent,
    CodeEditorComponent,
    NzModalFooterDirective,
  ],
})
export class CodeEditorModalComponent implements OnInit, OnChanges {
  private componentService = inject(ComponentService);
  private nzModalRef = inject(NzModalRef);
  private modalService = inject(ModalService);
  readonly data = inject<{
    elementId: string;
  }>(NZ_MODAL_DATA);

  @Input() elementId?: string;

  @ViewChild(CodeEditorComponent) codeEditorElement?: CodeEditorComponent;

  private readonly cdr = inject(ChangeDetectorRef);

  selectedElement?: SectionList | FormInputData;
  selectedElementCodeMirror: CodeEditorData = { enabled: false };
  variableList: CodeEditorVariable[] = [];
  isModal = false;

  CodeEditorMode = CodeEditorMode;
  CodeEditorType = CodeEditorType;
  CodeEditorVariableType = CodeEditorVariableType;

  ngOnInit(): void {
    if (this.data && this.data.elementId) {
      this.elementId = this.data.elementId;
      this.isModal = true;
    }

    this.getSelectedElement();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['elementId'] &&
      changes['elementId'].currentValue !== changes['elementId'].previousValue
    ) {
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
      this.variableList,
    );

    modal.afterClose.subscribe((variables?: CodeEditorVariable[]) => {
      if (variables && this.selectedElementCodeMirror.data) {
        this.selectedElementCodeMirror.data.variables = variables.sort((a, b) =>
          a.title.localeCompare(b.title),
        );
        this.cdr.markForCheck();
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
        this.selectedElementCodeMirror = this.selectedElement.codeEditor
          ? structuredClone(this.selectedElement.codeEditor)
          : { enabled: false };
      }

      this.variableList = this.componentService.getVariableList(this.elementId);
    }
  }
}
