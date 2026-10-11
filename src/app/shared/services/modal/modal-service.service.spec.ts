import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import type { ModalOptions, ModalButtonOptions } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';
import type { InputComponentData } from '@components/input/interfaces/input-component-data';
import { ModalServiceService } from './modal-service.service';

describe('ModalServiceService', () => {
  let service: ModalServiceService<string, InputComponentData, InputEditComponent>;
  let options: ModalOptions<InputEditComponent, InputComponentData>;
  let afterClose: Subject<unknown>;
  let close: jasmine.Spy;
  const data: InputComponentData = {
    required: false,
    showTooltip: false,
    minLength: false,
    maxLength: false,
    showCharacterCounter: false,
  };
  const modalData = {
    modalTitle: 'Edit question',
    modalContent: InputEditComponent,
    modalData: data,
  };

  beforeEach(() => {
    afterClose = new Subject();
    close = jasmine.createSpy('close');
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
        {
          provide: NzModalService,
          useValue: {
            create: (config: typeof options) => {
              options = config;
              return { close, afterClose };
            },
          },
        },
      ],
    });
    service = TestBed.inject(ModalServiceService);
  });

  function buttons(): ModalButtonOptions<InputEditComponent>[] {
    if (!Array.isArray(options.nzFooter)) throw new Error('Expected modal action buttons');
    return options.nzFooter;
  }

  it('opens the requested editor and forwards its closing result', () => {
    const result = jasmine.createSpy('result');
    service.openModal(modalData).subscribe(result);
    expect(options).toEqual(
      jasmine.objectContaining({
        nzTitle: 'Edit question',
        nzContent: InputEditComponent,
        nzData: data,
      }),
    );
    afterClose.next(true);
    afterClose.complete();
    expect(result).toHaveBeenCalledOnceWith(true);
  });

  it('cancels without saving and delegates reset to the editor', () => {
    const editor = jasmine.createSpyObj<InputEditComponent>('editor', ['onSave', 'onReset']);
    service.openModal(modalData);
    buttons()[0].onClick!(editor);
    expect(close).toHaveBeenCalledWith();
    expect(editor.onSave).not.toHaveBeenCalled();
    buttons()[1].onClick!(editor);
    expect(editor.onReset).toHaveBeenCalledTimes(1);
  });

  it('disables save for an invalid or missing editor and returns save success', () => {
    const editor = jasmine.createSpyObj<InputEditComponent>('editor', ['onSave'], {
      isInvalid: false,
    });
    editor.onSave.and.returnValue(true);
    service.openModal(modalData);
    const save = buttons()[2];
    if (typeof save.disabled !== 'function') throw new Error('Expected dynamic save validation');
    expect(save.disabled()).toBeTrue();
    expect(save.disabled(editor)).toBeFalse();
    const invalid = jasmine.createSpyObj<InputEditComponent>('invalid', ['onSave'], {
      isInvalid: true,
    });
    expect(save.disabled(invalid)).toBeTrue();
    save.onClick!(editor);
    expect(editor.onSave).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledWith(true);
  });

  it('returns custom editor data after saving when a getter is supplied', () => {
    const editor = jasmine.createSpyObj<InputEditComponent>('editor', ['onSave']);
    const getData = jasmine.createSpy('getData').and.returnValue('saved data');
    service.openModalAndGet(modalData, getData);
    buttons()[2].onClick!(editor);
    expect(editor.onSave).toHaveBeenCalledTimes(1);
    expect(getData).toHaveBeenCalledWith(editor);
    expect(close).toHaveBeenCalledWith('saved data');
  });
});
