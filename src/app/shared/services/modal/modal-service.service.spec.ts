import { TestBed } from '@angular/core/testing';

import { ModalServiceService } from '@services/modal/modal-service.service';
import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { InputData } from '@interfaces/input-data';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';

describe('ModalServiceService', () => {
  let service: ModalServiceService<unknown, InputData<unknown>, AbstractEditForm<unknown, InputData<unknown>>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NzModalService, useValue: {} },
        { provide: TranslateService, useValue: {} },
      ],
    });
    service = TestBed.inject(ModalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
