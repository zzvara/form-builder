import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CodeEditorVariableType } from '@app/shared/enums/code-editor.enum';
import type { CodeEditorVariable } from '@app/shared/interfaces/code-editor.interface';
import { NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef } from 'ng-zorro-antd/modal';
import type { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
import { NzTransferComponent } from 'ng-zorro-antd/transfer';
import { TranslatePipe } from '@ngx-translate/core';
import { VariableIconPipe } from '@shared/pipes/variable-icon.pipe';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-variable-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ],
})
export class VariableModalComponent {
  private nzModalRef = inject(NzModalRef);
  readonly data = inject<{
    selectedVariables: CodeEditorVariable[];
    allVariables: CodeEditorVariable[];
  }>(NZ_MODAL_DATA);

  allVariables: TransferItem[] = [];
  private selectedVariables: CodeEditorVariable[] = [];

  CodeEditorVariableType = CodeEditorVariableType;

  constructor() {
    this.allVariables = this.data.allVariables.map((item) => ({
      key: item.elementId,
      title: item.title,
      type: item.type,
      elementId: item.elementId,
      direction: this.data.selectedVariables.find(
        (selectedVariable) => selectedVariable.elementId === item.elementId,
      )
        ? 'right'
        : 'left',
    }));
    this.selectedVariables = structuredClone(this.data.selectedVariables);
  }

  onChange(event: TransferChange) {
    if (event.from === 'left' && event.to === 'right') {
      const elementIds = event.list.map((item) => item['elementId']);
      this.selectedVariables.push(
        ...this.data.allVariables.filter((item) => elementIds.includes(item.elementId)),
      );
    } else if (event.from === 'right' && event.to === 'left') {
      const elementIds = event.list.map((item) => item['elementId']);
      this.selectedVariables = this.selectedVariables.filter(
        (item) => !elementIds.includes(item.elementId),
      );
    }
  }

  closeModal(): void {
    this.nzModalRef.close();
  }

  saveModal(): void {
    this.nzModalRef.close(this.selectedVariables);
  }
}
