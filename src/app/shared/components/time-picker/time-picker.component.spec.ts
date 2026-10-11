import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { TimePickerEditComponent } from './time-picker-edit/time-picker-edit.component';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TimePickerComponent } from '@components/time-picker/time-picker.component';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimePickerComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'TimePickerComponent',
    )!;
    fixture.componentRef.setInput('data', formInput.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens its editor and publishes changes only when saved', () => {
    const open = spyOn(TestBed.inject(ModalServiceService), 'openModal').and.returnValue(
      of(undefined),
    );
    const edited = spyOn(component.edited, 'emit');
    component.edit();
    expect(open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        modalContent: TimePickerEditComponent,
        modalData: component.data,
      }),
    );
    expect(edited).not.toHaveBeenCalled();
    open.and.returnValue(of(true));
    component.edit();
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });
});
