import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalService } from './modal.service';
import { sectionFixture } from '@app/testing/fixtures';
import { VariableModalComponent } from '../components/code-editor/variable-modal/variable-modal.component';
import { CodeEditorModalComponent } from '../components/code-editor/code-editor-modal/code-editor-modal.component';

describe('ModalService', () => {
  const modalRef = { close: () => undefined };
  let create: jasmine.Spy;
  let service: ModalService;

  beforeEach(() => {
    create = jasmine.createSpy('create').and.returnValue(modalRef);
    TestBed.configureTestingModule({
      providers: [
        { provide: NzModalService, useValue: { create } },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    service = TestBed.inject(ModalService);
  });

  it('opens variable selection with the supplied selections', () => {
    expect(service.openVariableModal([], []).close).toBe(modalRef.close);
    expect(create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nzContent: VariableModalComponent,
        nzData: { selectedVariables: [], allVariables: [] },
      }),
    );
  });

  it('opens the code editor with the section id', () => {
    expect(service.openSectionModal(sectionFixture('section')).close).toBe(modalRef.close);
    expect(create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nzContent: CodeEditorModalComponent,
        nzData: { elementId: 'section' },
      }),
    );
  });
});
