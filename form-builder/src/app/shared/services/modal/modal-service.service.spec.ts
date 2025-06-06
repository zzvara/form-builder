import { TestBed } from '@angular/core/testing';

import { ModalServiceService } from '@services/modal/modal-service.service';

describe('ModalServiceService', () => {
  let service: ModalServiceService<any, any, any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
