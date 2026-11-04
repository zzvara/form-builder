import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { RangePickerEditComponent } from './range-picker-edit/range-picker-edit.component';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RangePickerComponent } from '@components/range-picker/range-picker.component';

describe('RangePickerComponent', () => {
  let component: RangePickerComponent;
  let fixture: ComponentFixture<RangePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RangePickerComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(RangePickerComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'RangePickerComponent',
    )!;
    fixture.componentRef.setInput('data', formInput.data);
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
        modalContent: RangePickerEditComponent,
        modalData: component.data,
      }),
    );
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });

  it('splits the start and end placeholders and handles an absent placeholder', () => {
    component.data.placeholderValue = 'Start|End|Ignored';
    expect(component.getPlaceholder()).toEqual(['Start', 'End']);
    component.data.placeholderValue = undefined;
    expect(component.getPlaceholder()).toEqual([]);
  });
});
