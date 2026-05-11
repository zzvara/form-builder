import { Component, Inject } from '@angular/core';
import { CodeEditorVariableType } from '@app/shared/enums/code-editor.enum';
import { CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import {NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef} from 'ng-zorro-antd/modal';
import {NzTransferComponent, TransferChange, TransferItem} from 'ng-zorro-antd/transfer';
import {TranslatePipe} from "@ngx-translate/core";
import {VariableIconPipe} from "@shared/pipes/variable-icon.pipe";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {FormsModule} from "@angular/forms";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {CodeEditorComponent} from "@components/code-editor/code-editor.component";

@Component({
  selector: 'app-variable-modal',
  standalone: true,
  templateUrl: './variable-modal.component.html',
  imports: [
    TranslatePipe,
    VariableIconPipe,
    NzDividerModule,
    NzIconModule,
    NzTooltipDirective,
    FormsModule,
    NzTransferComponent,
    NzModalFooterDirective,

  ]
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
      key: item.elementId,
      title: item.title,
      type: item.type,
      elementId: item.elementId,
      direction: this.data.selectedVariables.find((selectedVariable) => selectedVariable.elementId === item.elementId) ? 'right' : 'left',
    }));
    this.selectedVariables = structuredClone(this.data.selectedVariables);
  }

  onChange(event: TransferChange) {
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
