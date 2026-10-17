import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TimePickerEditComponent } from '@components/time-picker/time-picker-edit/time-picker-edit.component';

describe('TimePickerEditComponent', () => {
  let component: TimePickerEditComponent;
  let fixture: ComponentFixture<TimePickerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimePickerEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        {
          provide: NZ_MODAL_DATA,
          useValue: { timeFormat: 'HH:mm:ss', hourStep: 1, minuteStep: 1, secondStep: 1 },
        },
      ],
    });
    fixture = TestBed.createComponent(TimePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
