import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import type { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';

describe('DatePickerEditComponent', () => {
  type DatePickerEditFixture = DatePickerEditComponent<
    Date | Date[],
    DatePickerComponentData<Date | Date[]>
  >;

  let component: DatePickerEditFixture;
  let fixture: ComponentFixture<DatePickerEditFixture>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatePickerEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NZ_MODAL_DATA, useValue: { mode: 'date', dateFormat: 'yyyy-MM-dd' } },
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
      ],
    });
    fixture = TestBed.createComponent(DatePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
