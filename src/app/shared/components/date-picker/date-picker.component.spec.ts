import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { DatePickerEditComponent } from './date-picker-edit/date-picker-edit.component';
import { appConfig } from '@app/app.config';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DatePickerComponent } from '@components/date-picker/date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatePickerComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    const input = getInputGroups(TestBed.inject(TranslateService)).find(
      (item) => item.type === 'DatePickerComponent',
    )!;
    fixture.componentRef.setInput('data', input.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens its settings editor and publishes saved changes', () => {
    const open = spyOn(TestBed.inject(ModalServiceService), 'openModal').and.returnValue(of(true));
    const edited = spyOn(component.edited, 'emit');
    component.edit();
    expect(open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        modalContent: DatePickerEditComponent,
        modalData: component.data,
      }),
    );
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });
  
  it('adds time formatting and restrictions only when showTime is enabled', () => {
    Object.assign(component.data, {
      dateFormat: 'yyyy-MM-dd',
      timeFormat: ' HH:mm',
      showTime: false,
    });
    expect(component.getFullFormat).toBe('yyyy-MM-dd');
    expect(component.getTimeOptions).toBeNull();
    expect(component.disabledTime(new Date())).toBeUndefined();
    component.data.showTime = true;
    expect(component.getFullFormat).toBe('yyyy-MM-dd HH:mm');
    expect(component.getTimeOptions).toEqual({ nzFormat: ' HH:mm', nzHideDisabledOptions: false });
    expect(component.disabledTime(new Date())!.nzDisabledHours!()).toEqual([]);
  });
});
