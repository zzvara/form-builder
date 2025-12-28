import { Component, Inject } from '@angular/core';
import { CodeEditorVariableType } from '@app/shared/enums/code-editor.enum';
import { CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-variable-modal',
  standalone: false,
  templateUrl: './variable-modal.component.html',
})
export class VariableModalComponent {
  allVariables: TransferItem[] = [];
  private selectedVariables: CodeEditorVariable[] = [];

  CodeEditorVariableType = CodeEditorVariableType;

  constructor(
    private nzModalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public readonly data: { selectedVariables: CodeEditorVariable[]; allVariables: CodeEditorVariable[] }
  ) {
    this.allVariables = this.data.allVariables.map((item) => ({
      title: item.title,
      type: item.type,
      elementId: item.elementId,
      direction: this.data.selectedVariables.find((selectedVariable) => selectedVariable.elementId === item.elementId) ? 'right' : 'left',
    }));
    this.selectedVariables = structuredClone(this.data.selectedVariables);
  }

  onChange(event: TransferChange) {
    console.log(event);
    if (event.from === 'left' && event.to === 'right') {
      const elementIds = event.list.map((item) => item['elementId']);
      this.selectedVariables.push(...this.data.allVariables.filter((item) => elementIds.includes(item.elementId)));
    } else if (event.from === 'right' && event.to === 'left') {
      const elementIds = event.list.map((item) => item['elementId']);
      this.selectedVariables = this.selectedVariables.filter((item) => !elementIds.includes(item.elementId));
    }
  }

  closeModal(): void {
    this.nzModalRef.close();
  }

  saveModal(): void {
    this.nzModalRef.close(this.selectedVariables);
  }
}
