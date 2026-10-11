import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureInputEditComponent } from './picture-input-edit.component';

describe('PictureInputEditComponent', () => {
  let component: PictureInputEditComponent;
  let fixture: ComponentFixture<PictureInputEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PictureInputEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(PictureInputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
