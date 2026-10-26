import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RangePickerEditComponent } from '@components/range-picker/range-picker-edit/range-picker-edit.component';

describe('RangePickerEditComponent', () => {
  let component: RangePickerEditComponent;
  let fixture: ComponentFixture<RangePickerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RangePickerEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(RangePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
