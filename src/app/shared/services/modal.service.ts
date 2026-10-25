import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CodeEditorVariable } from '../interfaces/code-editor.interface';
import { SectionList } from '@app/pages/edit/interfaces/section-list';
import { CodeEditorModalComponent } from '../components/code-editor/code-editor-modal/code-editor-modal.component';
import { VariableModalComponent } from '../components/code-editor/variable-modal/variable-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private modal: NzModalService,
    private translate: TranslateService
  ) {}

  openVariableModal(selectedVariables: CodeEditorVariable[], allVariables: CodeEditorVariable[]): NzModalRef<VariableModalComponent, any> {
    return this.modal.create({
      nzTitle: this.translate.instant('COMPONENTS.CONDITION_SETTINGS.VARIABLE_MODAL.TITLE'),
      nzContent: VariableModalComponent,
      nzData: { selectedVariables, allVariables },
    });
  }

  openSectionModal(section: SectionList): NzModalRef {
    return this.modal.create({
      nzTitle: this.translate.instant('COMPONENTS.SECTION.MODAL_RADIO_GROUP_TITLE'),
      nzContent: CodeEditorModalComponent,
      nzData: { elementId: section.data.id },
    });
  }
}
